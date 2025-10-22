import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os

# Set style for better plots
plt.style.use('default')
sns.set_palette("husl")

# ===== STEP 1: Load preprocessed data =====
df = pd.read_csv("../processed_students_levels.csv")
print("[OK] Data loaded successfully! Shape:", df.shape)

# Handle missing values
df = df.fillna("Medium")
print("[OK] Missing values handled. Remaining NaNs:", df.isna().sum().sum())

# ===== STEP 2: Prepare features for clustering =====
# Select relevant columns for clustering (skills and performance metrics)
skill_columns = [
    "Adaptability", "Blockchain", "C#", "C++", "Cloud Computing",
    "Communication", "Cybersecurity", "Data Analysis", "Go", "Java",
    "JavaScript", "Leadership", "Machine Learning", "Problem-Solving",
    "Python", "R", "SQL", "Teamwork", "Time Management"
]

# Performance columns
performance_columns = ["Quiz", "Midterm", "Assignment_1", "Assignment_2", "Assignment_3", "Project", "Presentation", "Final_Exam", "Total"]

# Create feature dataframe
feature_columns = skill_columns + performance_columns
available_columns = [col for col in feature_columns if col in df.columns]
print(f"[OK] Using columns for clustering: {available_columns}")

# ===== STEP 3: Encode categorical features =====
df_encoded = df.copy()

# Encode High/Medium/Low to numeric values
for col in available_columns:
    if col in skill_columns and col in df.columns:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df_encoded[col])

print("[OK] Categorical features encoded!")

# ===== STEP 4: Scale the data =====
scaler = StandardScaler()
scaled_data = scaler.fit_transform(df_encoded[available_columns])
print("[OK] Features scaled successfully!")

# ===== STEP 5: Find the best number of clusters (Elbow Method) =====
inertias = []
K_RANGE = range(2, 11)

print("[INFO] Finding optimal number of clusters...")
for k in K_RANGE:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(scaled_data)
    inertias.append(kmeans.inertia_)

# Create elbow plot
plt.figure(figsize=(10, 6))
plt.plot(K_RANGE, inertias, marker='o', linewidth=2, markersize=8)
plt.xlabel('Number of Clusters (k)', fontsize=12)
plt.ylabel('Inertia', fontsize=12)
plt.title('Elbow Method for Optimal k', fontsize=14, fontweight='bold')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('../elbow_plot.png', dpi=300, bbox_inches='tight')
plt.close()  # Close to free memory
print("[OK] Elbow plot saved as elbow_plot.png")

# ===== STEP 6: PCA Visualization =====
pca = PCA(n_components=2)
pca_data = pca.fit_transform(scaled_data)

# ===== STEP 7: Train final KMeans model =====
# Choose k based on elbow plot (typically 4-6 for student grouping)
OPTIMAL_K = 4
kmeans = KMeans(n_clusters=OPTIMAL_K, random_state=42, n_init=10)
df['Cluster'] = kmeans.fit_predict(scaled_data)

print(f"\n[OK] Clustering complete using k={OPTIMAL_K}")
print("Cluster distribution:")
print(df['Cluster'].value_counts().sort_index())

# ===== STEP 8: Create PCA scatter plot =====
plt.figure(figsize=(12, 8))
colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown', 'pink', 'gray']
for i in range(OPTIMAL_K):
    cluster_data = pca_data[df['Cluster'] == i]
    plt.scatter(cluster_data[:, 0], cluster_data[:, 1], 
               c=colors[i], label=f'Cluster {i+1}', alpha=0.7, s=50)

plt.xlabel(f'First Principal Component (Explained Variance: {pca.explained_variance_ratio_[0]:.2%})', fontsize=12)
plt.ylabel(f'Second Principal Component (Explained Variance: {pca.explained_variance_ratio_[1]:.2%})', fontsize=12)
plt.title('PCA Scatter Plot of Student Clusters', fontsize=14, fontweight='bold')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('../pca_scatter_plot.png', dpi=300, bbox_inches='tight')
plt.close()  # Close to free memory
print("[OK] PCA scatter plot saved as pca_scatter_plot.png")

# ===== STEP 9: Create Team Skill Bar Charts =====
# Calculate average skills for each cluster
# First, convert skill columns to numeric for mean calculation
df_skills_numeric = df[skill_columns].copy()
for col in skill_columns:
    if col in df_skills_numeric.columns:
        # Convert High/Medium/Low to numeric values
        df_skills_numeric[col] = df_skills_numeric[col].map({'High': 3, 'Medium': 2, 'Low': 1})

cluster_skills = df_skills_numeric.groupby(df['Cluster']).mean()

# Create skill bar chart
fig, axes = plt.subplots(2, 2, figsize=(16, 12))
axes = axes.flatten()

for i in range(OPTIMAL_K):
    if i < len(axes):
        cluster_data = cluster_skills.iloc[i]
        cluster_data.plot(kind='bar', ax=axes[i], color=colors[i], alpha=0.7)
        axes[i].set_title(f'Team {i+1} Average Skills', fontweight='bold')
        axes[i].set_xlabel('Skills')
        axes[i].set_ylabel('Average Level')
        axes[i].tick_params(axis='x', rotation=45)
        axes[i].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('../team_skill_bar_charts.png', dpi=300, bbox_inches='tight')
plt.close()  # Close to free memory
print("[OK] Team skill bar charts saved as team_skill_bar_charts.png")

# ===== STEP 10: Form Teams =====
def form_teams(df, team_size):
    teams = []
    for cluster in df['Cluster'].unique():
        cluster_members = df[df['Cluster'] == cluster].copy()
        # Shuffle to randomize team formation within clusters
        cluster_members = cluster_members.sample(frac=1, random_state=42).reset_index(drop=True)
        
        for i in range(0, len(cluster_members), team_size):
            team = cluster_members.iloc[i:i + team_size].copy()
            team['Team_Number'] = len(teams) + 1
            teams.append(team)
    return teams

# Form teams with 4 members each
teams = form_teams(df, team_size=4)

# Combine all teams into a single DataFrame
if teams:
    team_output = pd.concat(teams, ignore_index=True)
    team_output.to_csv("clustered_teams.csv", index=False)
    print(f"\n[OK] Teams formed and saved to clustered_teams.csv")
    print(f"[OK] Total teams created: {len(teams)}")
    print(f"[OK] Total students assigned: {len(team_output)}")
else:
    print("[WARNING] No teams could be formed")

# ===== STEP 11: Save model and scaler =====
joblib.dump(kmeans, "team_model.pkl")
joblib.dump(scaler, "scaler.pkl")
print("[OK] Model and scaler saved (team_model.pkl & scaler.pkl)")

# ===== STEP 12: Generate summary statistics =====
print("\n[INFO] CLUSTERING SUMMARY:")
print("=" * 50)
print(f"Total students: {len(df)}")
print(f"Number of clusters: {OPTIMAL_K}")
print(f"Teams formed: {len(teams)}")
print(f"Average team size: {len(df) / len(teams) if teams else 0:.1f}")

print("\n[INFO] CLUSTER CHARACTERISTICS:")
for i in range(OPTIMAL_K):
    cluster_size = len(df[df['Cluster'] == i])
    print(f"Cluster {i+1}: {cluster_size} students")
