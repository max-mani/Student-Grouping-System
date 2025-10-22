# ----------------------------------------------------
# 1. Import Libraries
# ----------------------------------------------------
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, MultiLabelBinarizer

# ----------------------------------------------------
# 2. Load Dataset
# ----------------------------------------------------
df = pd.read_excel("Combined_Student_Grouping.xlsx",
                   sheet_name="Combined_Student_Grouping")

print("Original Shape:", df.shape)
print("Columns in file:\n", df.columns.tolist())

# ----------------------------------------------------
# 3. Handle Missing Values
# ----------------------------------------------------
# List of possible score columns
possible_cols = [
    'Quiz', 'Midterm', 'Assignment_1', 'Assignment_2',
    'Assignment_3', 'Project', 'Presentation', 'Final_Exam', 'Total'
]

# Pick only those that exist in the dataset
score_cols = [c for c in possible_cols if c in df.columns]
print("Using score columns:", score_cols)

# Fill missing numerical scores with the column mean
if score_cols:
    df[score_cols] = df[score_cols].fillna(df[score_cols].mean())

# Handle categorical columns
cat_cols = ['technical_skills', 'programming_languages', 'soft_skills', 'Grade', 'Categories']
cat_cols = [c for c in cat_cols if c in df.columns]
df[cat_cols] = df[cat_cols].fillna('Unknown')

print("\nMissing values after imputation:\n", df.isnull().sum())

# ----------------------------------------------------
# 4. Normalize Scores (Scaling)
# ----------------------------------------------------
if score_cols:
    scaler = MinMaxScaler()
    df[score_cols] = scaler.fit_transform(df[score_cols])

print("\nScaled Scores (first 5 rows):\n", df[score_cols].head())

# ----------------------------------------------------
# 5. Encode Categorical Skills
# ----------------------------------------------------
# Convert comma-separated skills into lists
if 'technical_skills' in df.columns:
    df['technical_skills'] = df['technical_skills'].apply(lambda x: [s.strip() for s in str(x).split(',')])
if 'programming_languages' in df.columns:
    df['programming_languages'] = df['programming_languages'].apply(lambda x: [s.strip() for s in str(x).split(',')])
if 'soft_skills' in df.columns:
    df['soft_skills'] = df['soft_skills'].apply(lambda x: [s.strip() for s in str(x).split(',')])

# Combine all skill columns into one list per student
skill_cols = [c for c in ['technical_skills', 'programming_languages', 'soft_skills'] if c in df.columns]
if skill_cols:
    df['all_skills'] = df[skill_cols].sum(axis=1)  # merges lists

    # Apply MultiLabelBinarizer
    mlb = MultiLabelBinarizer()
    skills_encoded = pd.DataFrame(
        mlb.fit_transform(df['all_skills']),
        columns=mlb.classes_,
        index=df.index
    )

    # Concatenate encoded skills with main DataFrame
    df_processed = pd.concat([df, skills_encoded], axis=1)

    # Drop original text skill columns
    df_processed = df_processed.drop(columns=skill_cols + ['all_skills'])
else:
    df_processed = df.copy()

print("\nProcessed Dataset Shape:", df_processed.shape)
print("\nPreview:\n", df_processed.head())

# ----------------------------------------------------
# 6. Save Processed Data (Optional)
# ----------------------------------------------------
df_processed.to_csv("processed_students.csv", index=False)
print("\nProcessed data saved to processed_students.csv")
