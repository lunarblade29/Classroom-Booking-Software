# 🎓 Classroom Booking System

A sleek and simple **Flask-based web application** that allows users to upload classroom schedules via Excel files, stores the data in a SQLite database, and displays booking information in a user-friendly interface.

---

## 📁 Project Structure

```
Classroom-Booking/
│
├── instance/
│   └── bookings.db              # SQLite database file
│
├── static/                     # Static assets (CSS & JavaScript)
│   ├── schedule.css
│   ├── style.css
│   ├── schedule.js
│   └── script.js
│
├── templates/                  # HTML Templates for rendering
│   ├── index.html
│   └── schedule.html
│
├── uploads/                    # Temporary folder for uploaded Excel files (auto-cleaned)
│
├── main.py                     # Main Flask app
├── schedule.py                 # Schedule-related logic
├── requirements.txt            # Python dependencies
└── README.md                   # This file ✨
```

---

## 🚀 Features

✅ Upload Excel files (.xlsx) containing classroom bookings  
✅ Auto-check required columns: `professor`, `room`, `date`, `start_time`, `end_time`  
✅ Auto-format date and time  
✅ Store entries in a **SQLite database**  
✅ View schedules via frontend UI  
✅ **Auto-delete uploaded Excel file** after database update (keeps folder clean!)

---

## 📤 Excel File Format (Required Columns)

Please make sure your Excel file has the following columns (case-sensitive):

| professor | room | date       | start_time | end_time  |
|-----------|------|------------|------------|-----------|
| Dr. Smith | A101 | 2024-03-15 | 09:00      | 11:00     |

---

## 💻 Tech Stack

- **Python 3.10+**
- **Flask**
- **SQLite**
- **Pandas**
- **HTML / CSS / JS**

---

## 🧠 How It Works

1. User uploads a `.xlsx` file via the web UI.
2. Flask processes and validates the file.
3. Data is parsed using **Pandas** and added to the database.
4. File is **automatically deleted** from the `/uploads` folder.
5. Data is displayed through a responsive frontend.

---

## ⚙️ How to Run

```bash
# 1️⃣ Clone the repo
git clone https://github.com/your-repo/Classroom-Booking.git
cd Classroom-Booking

# 2️⃣ Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate     # On Windows: venv\Scripts\activate

# 3️⃣ Install dependencies
pip install -r requirements.txt

# 4️⃣ Run the application
python main.py
```

The app will be available at: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 📌 Notes

- The **uploaded files are cleaned** immediately after use to keep storage optimized.
- You can customize templates in `/templates/` or styles in `/static/`.

---

## 🗂 Sample `.env` or Config (optional)

If using environment configs:
```
UPLOAD_FOLDER = 'uploads'
DATABASE = 'instance/bookings.db'
```

---

## ✨ Screenshots

_Add screenshots here (optional) for better presentation._

---

## 🤝 Contribution

Pull requests and feature ideas are welcome!  
Just fork it, improve it, and raise a PR. 💡

---

## 📜 License

MIT License — Free to use, modify, and share.

---

## 💬 Developed With ❤️ 
`Sanjiv Jadhav` | [LinkedIn](https://www.linkedin.com/in/sanjiv-j-6265041b8/) | [GitHub](https://github.com/lunarblade29)