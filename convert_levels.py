import pandas as pd
import numpy as np

# === Load your dataset ===
df = pd.read_csv("processed_students.csv")
print(f"[OK] Original dataset loaded: {df.shape}")

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

# === Convert each existing column ===
for col in existing_columns:
    df[col] = df[col].apply(convert_to_levels)
    print(f"[OK] Converted column: {col}")

# === Handle missing values in other columns ===
# Fill missing values in numeric columns with median
numeric_columns = df.select_dtypes(include=[np.number]).columns
for col in numeric_columns:
    if col not in existing_columns:
        df[col] = df[col].fillna(df[col].median())

# Fill missing values in categorical columns with mode
categorical_columns = df.select_dtypes(include=['object']).columns
for col in categorical_columns:
    if col not in existing_columns:
        df[col] = df[col].fillna(df[col].mode().iloc[0] if not df[col].mode().empty else "Unknown")

print(f"[OK] Missing values handled. Remaining NaNs: {df.isna().sum().sum()}")

# === Save the modified file ===
output_file = "processed_students_levels.csv"
df.to_csv(output_file, index=False)

print(f"[OK] Conversion complete! Saved as {output_file}")
print(f"[OK] Final dataset shape: {df.shape}")
print(f"[OK] Sample of converted data:")
print(df[existing_columns[:5]].head())
