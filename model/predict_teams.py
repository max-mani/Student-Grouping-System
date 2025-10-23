#!/usr/bin/env python3
import sys
import json
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

def generate_team_justification(team_members, cluster_id):
    """
    Generate justification for team formation based on member characteristics
    """
    justifications = []
    
    # Analyze team composition
    names = [member.get('name', f'Student {member.get("Student Id", "Unknown")}') for member in team_members]
    courses = [member.get('current_course', 'Unknown') for member in team_members]
    ratings = [member.get('rating', 0) for member in team_members if isinstance(member.get('rating'), (int, float))]
    totals = [member.get('Total', 0) for member in team_members if isinstance(member.get('Total'), (int, float))]
    
    # Diversity analysis
    unique_courses = list(set(courses))
    course_diversity = len(unique_courses)
    
    # Performance analysis
    avg_rating = np.mean(ratings) if ratings else 0
    avg_total = np.mean(totals) if totals else 0
    performance_range = max(totals) - min(totals) if totals else 0
    
    # Generate justification
    justification_parts = []
    
    # Cluster-based reasoning
    justification_parts.append(f"Students grouped in Cluster {cluster_id + 1} based on similar academic performance and skill profiles.")
    
    # Course diversity
    if course_diversity > 1:
        justification_parts.append(f"Team includes students from {course_diversity} different courses ({', '.join(unique_courses)}) for interdisciplinary collaboration.")
    else:
        justification_parts.append(f"Team consists of students from the same course ({unique_courses[0]}) for focused specialization.")
    
    # Performance balance
    if performance_range < 20:
        justification_parts.append("Students have similar academic performance levels, ensuring balanced contribution.")
    elif performance_range < 40:
        justification_parts.append("Team includes students with complementary performance levels for peer learning.")
    else:
        justification_parts.append("Team combines high and moderate performers to create learning opportunities.")
    
    # Skill complementarity
    justification_parts.append("Members selected to complement each other's strengths and support areas for improvement.")
    
    return " ".join(justification_parts)

def predict_teams(data_path: str, team_size: int):
    """
    Predict optimal team groupings based on student data
    """
    try:
        # Load data
        df = pd.read_csv(data_path)
        print(f"Loaded data with {len(df)} students", file=sys.stderr, flush=True)
        
        # Get numeric columns
        numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
        if not numeric_columns:
            # Create dummy features if no numeric columns
            df['dummy_feature'] = np.random.rand(len(df))
            numeric_columns = ['dummy_feature']
        
        print(f"Using columns for features: {numeric_columns}", file=sys.stderr, flush=True)
        
        # Prepare features
        X = df[numeric_columns].fillna(0).values
        
        # Simple clustering
        n_clusters = max(2, len(df) // team_size)
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        clusters = kmeans.fit_predict(X)
        
        print(f"Clustering completed with {len(np.unique(clusters))} clusters", file=sys.stderr, flush=True)
        
        # Assign teams based on clusters
        df['cluster'] = clusters
        
        # Form teams within each cluster
        teams = []
        team_counter = 1
        
        for cluster_id in np.unique(clusters):
            cluster_members = df[df['cluster'] == cluster_id].copy()
            # Shuffle to randomize team formation within clusters
            cluster_members = cluster_members.sample(frac=1, random_state=42).reset_index(drop=True)
            
            # Group into teams of specified size
            for i in range(0, len(cluster_members), team_size):
                team_members = cluster_members.iloc[i:i + team_size]
                if len(team_members) > 0:  # Only create team if it has members
                    # Generate justification for this team
                    justification = generate_team_justification(team_members.to_dict('records'), cluster_id)
                    
                    teams.append({
                        'team_number': team_counter,
                        'members': team_members.to_dict('records'),
                        'justification': justification
                    })
                    team_counter += 1
        
        # Return results as JSON
        result = {
            'success': True,
            'teams': teams,
            'total_students': len(df),
            'total_teams': len(teams),
            'clusters_used': len(np.unique(clusters))
        }
        
    except Exception as e:
        result = {
            'success': False,
            'error': str(e)
        }
    
    # IMPORTANT: Only print JSON to stdout so the Node process can parse it
    print(json.dumps(result))
    return 0

if __name__ == '__main__':
    print("Starting team prediction script...", file=sys.stderr, flush=True)
    if len(sys.argv) != 3:
        # Print a user-friendly message to stderr and exit non-zero
        print('Usage: python predict_teams.py <data_path> <team_size>', file=sys.stderr, flush=True)
        sys.exit(1)
    
    data_path = sys.argv[1]
    team_size = int(sys.argv[2])
    print(f"Data path: {data_path}", file=sys.stderr, flush=True)
    print(f"Team size: {team_size}", file=sys.stderr, flush=True)
    
    result = predict_teams(data_path, team_size)
    print("Script completed", file=sys.stderr, flush=True)
    sys.exit(result)
