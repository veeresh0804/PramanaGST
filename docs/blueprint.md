# **App Name**: PramanaGST

## Core Features:

- Data Upload & Ingestion: Allow users to securely upload purchase register and GSTR data files (CSV, Excel) for processing into the system.
- Intelligent Reconciliation: Automatically match purchase invoices against GSTR data using both rule-based algorithms and machine learning fuzzy matching to identify discrepancies.
- Anomaly Detection & Risk Scoring: Employ advanced machine learning models (Isolation Forest, XGBoost) to detect suspicious transactions and calculate a comprehensive risk score for each vendor.
- Knowledge Graph & Data Modeling: Dynamically build and maintain a graph database (Neo4j) to represent complex relationships between vendors, invoices, and tax components, aiding in holistic analysis.
- Explainable AI Insights: Generate human-readable, context-rich explanations for calculated risk scores and detected anomalies using an LLM tool, detailing the contributing factors.
- Interactive Graph Visualization: Provide an interactive visual representation of the knowledge graph, allowing users to explore invoice relationships and identify potential fraud patterns via a force-directed layout.
- Dashboard & Reporting: Offer a centralized dashboard to monitor overall compliance health, visualize high-risk vendors and mismatched invoices, and access summary reports.

## Style Guidelines:

- Primary interactive color: A vibrant sky blue (#5AC2FF) to highlight key actions and emphasize intelligent insights on a dark theme.
- Background color: A deep midnight blue (#1D2126) for the main canvas, providing a professional and focused aesthetic in dark mode.
- Accent color: An energetic electric aqua (#4DE0E6) for complementary visual elements, providing a stimulating but harmonious contrast to the primary blue.
- All text (headlines and body) should use 'Inter', a clean and modern sans-serif font known for its excellent readability and neutrality, suitable for data-heavy applications.
- Utilize a consistent set of flat, modern, and functional line-art icons that clearly convey meaning without cluttering the data-intensive interface.
- Employ a responsive dashboard layout with a fixed or collapsible left sidebar for navigation and card-based sections to encapsulate data efficiently. Data tables and charts should prioritize clarity and hierarchical presentation.
- Incorporate subtle animations for UI transitions, smooth data loading indicators, and fluid interactivity for graph visualizations to enhance user experience.