# Cognitive Data Analyst

A full-stack application that leverages AI to provide intelligent data analysis and insights from CSV files. This project combines a Python backend with a React frontend to create an interactive data exploration experience.

## Project Overview

The Cognitive Data Analyst enables users to:
- Upload and analyze CSV data files
- Ask natural language questions about their data
- Receive AI-powered insights and visualizations
- Explore data through an intuitive web interface

## Project Structure

```
cognitive-data-analyst/
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── data/               # Data storage directory
│   │   └── Player.csv
│   └── utils/              # Utility modules
│       ├── csv_handler.py          # CSV file handling
│       ├── fallback_rules.py        # Fallback logic for queries
│       ├── prompt_builder.py        # AI prompt construction
│       ├── query_planner.py         # Query planning logic
│       ├── schema_helper.py         # Database schema utilities
│       ├── sql_builder.py           # SQL query building
│       └── sql_runner.py            # SQL execution
├── frontend/               # React web application
│   ├── package.json        # NPM dependencies
│   ├── public/             # Static files
│   └── src/
│       ├── App.js          # Main React component
│       ├── App.css         # Application styles
│       ├── index.js        # Entry point
│       └── components/     # React components
│           ├── AskBox.jsx         # Query input component
│           ├── DataPreview.jsx    # Data preview component
│           ├── FileUpload.jsx     # File upload component
│           ├── ResultChart.jsx    # Chart visualization
│           └── ResultTable.jsx    # Table display
└── Player.csv             # Sample dataset
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the Flask server:
   ```bash
   python app.py
   ```
   The backend will start at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will open at `http://localhost:3000`

## Usage

1. Open the application in your web browser at `http://localhost:3000`
2. Use the **File Upload** component to upload your CSV file
3. Preview your data using the **Data Preview** component
4. Ask questions about your data in the **Ask Box**
5. View results as tables or charts

## Key Features

- **Natural Language Queries**: Ask questions about your data in plain English
- **AI-Powered Analysis**: Leverages AI to understand and execute complex queries
- **Data Visualization**: View results as tables or interactive charts
- **CSV Support**: Work with any CSV file format
- **Fallback Logic**: Implements fallback rules for robust query handling
- **Schema Understanding**: Automatically analyzes your data structure

## Architecture

### Backend
- **Framework**: Flask (Python web framework)
- **Modules**:
  - `csv_handler.py`: Processes and parses CSV files
  - `query_planner.py`: Plans and optimizes data queries
  - `sql_builder.py`: Constructs SQL queries from natural language
  - `sql_runner.py`: Executes SQL queries and returns results
  - `prompt_builder.py`: Builds prompts for AI models
  - `schema_helper.py`: Extracts and manages data schema information
  - `fallback_rules.py`: Provides fallback strategies for query execution

### Frontend
- **Framework**: React (JavaScript UI library)
- **Components**:
  - `App.js`: Main application container
  - `FileUpload.jsx`: Handles file uploads
  - `DataPreview.jsx`: Displays data preview
  - `AskBox.jsx`: Query input interface
  - `ResultTable.jsx`: Tabular result display
  - `ResultChart.jsx`: Chart visualization

## Dependencies

### Backend
See `backend/requirements.txt` for complete Python dependencies.

### Frontend
See `frontend/package.json` for complete npm dependencies.

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Build for Production

#### Backend
```bash
cd backend
# Configure production settings and run with a production server
gunicorn app:app
```

#### Frontend
```bash
cd frontend
npm run build
```

## Troubleshooting

- **Port conflicts**: If ports 5000 or 3000 are already in use, modify the port settings in `app.py` and `frontend/package.json`
- **Module not found errors**: Ensure all dependencies are installed in both backend and frontend
- **CORS issues**: Check backend CORS configuration if frontend can't communicate with backend
- **CSV parsing errors**: Verify your CSV file format matches expected structure

## Contributing

Feel free to fork this project and submit pull requests for improvements.

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue in the project repository.

---

**Last Updated**: April 2026
