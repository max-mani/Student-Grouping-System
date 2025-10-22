import pandas as pd
import numpy as np

# === Load your dataset ===
df = pd.read_csv("processed_students.csv")
print(f"[OK] Original dataset loaded: {df.shape}")
print(f"[INFO] Initial missing values: {df.isna().sum().sum()}")

# === Function to convert values to High/Medium/Low ===
def convert_to_levels(value):
    if pd.isna(value):
        return "Medium"
    elif value in [1, "1", "yes", "Yes", "YES", True]:
        return "High"
    elif value in [0, "0", "no", "No", "NO", False]:
        return "Low"
    else:
        return "Medium"

# === Columns to convert ===
columns_to_convert = [
    "projects", "Adaptability", "Blockchain", "C#", "C++", "Cloud Computing",
    "Communication", "Cybersecurity", "Data Analysis", "Go", "Java",
    "JavaScript", "Leadership", "Machine Learning", "Problem-Solving",
    "Python", "R", "SQL", "Teamwork", "Time Management"
]

# === Check which columns exist ===
existing_columns = [col for col in columns_to_convert if col in df.columns]
missing_columns = [col for col in columns_to_convert if col not in df.columns]

print(f"[OK] Found columns: {existing_columns}")
if missing_columns:
    print(f"[WARNING] Missing columns: {missing_columns}")

# === Handle missing values FIRST before conversion ===
print(f"[INFO] Handling missing values...")

# Handle Student Id column - fill with sequential numbers
if 'Student Id' in df.columns and df['Student Id'].isna().any():
    max_id = df['Student Id'].max()
    if pd.isna(max_id):
        max_id = 0
    missing_mask = df['Student Id'].isna()
    df.loc[missing_mask, 'Student Id'] = range(int(max_id) + 1, int(max_id) + 1 + missing_mask.sum())
    print(f"[OK] Filled {missing_mask.sum()} missing Student Id values")

# Handle Quiz column - fill with median
if 'Quiz ' in df.columns and df['Quiz '].isna().any():
    quiz_median = df['Quiz '].median()
    df['Quiz '] = df['Quiz '].fillna(quiz_median)
    print(f"[OK] Filled Quiz column missing values with median: {quiz_median}")

# Fill missing values in other numeric columns with median
numeric_columns = df.select_dtypes(include=[np.number]).columns
for col in numeric_columns:
    if col not in existing_columns and df[col].isna().any():
        median_val = df[col].median()
        df[col] = df[col].fillna(median_val)
        print(f"[OK] Filled {col} missing values with median: {median_val}")

# Fill missing values in categorical columns with mode
categorical_columns = df.select_dtypes(include=['object']).columns
for col in categorical_columns:
    if col not in existing_columns and df[col].isna().any():
        mode_val = df[col].mode().iloc[0] if not df[col].mode().empty else "Unknown"
        df[col] = df[col].fillna(mode_val)
        print(f"[OK] Filled {col} missing values with mode: {mode_val}")

print(f"[OK] Missing values handled. Remaining NaNs: {df.isna().sum().sum()}")

# === Convert each existing column ===
for col in existing_columns:
    df[col] = df[col].apply(convert_to_levels)
    print(f"[OK] Converted column: {col}")

# === Save the modified file ===
output_file = "processed_students_levels.csv"
df.to_csv(output_file, index=False)

print(f"[OK] Conversion complete! Saved as {output_file}")
print(f"[OK] Final dataset shape: {df.shape}")
print(f"[OK] Final missing values: {df.isna().sum().sum()}")
print(f"[OK] Sample of converted data:")
print(df[existing_columns[:5]].head())
