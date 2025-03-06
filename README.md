# **Classroom Booking System🏛️**  

This is a **Flask-based web application** for booking classrooms by professors. The system allows users to book rooms for specific time slots, prevents overlapping bookings, and provides an intuitive UI for managing reservations.

---

## **📌 Features**
- 📅 **Book classrooms** by selecting a professor, room, date, start time, and end time.
- 🔄 **Automatic conflict detection**: Prevents double bookings for the same time slot.
- 📋 **View all bookings** sorted by **date and time (latest first)**.
- ❌ **Delete bookings** with a single click.
- 🔍 **Auto-suggest professor names** based on input.

---

## **⚙️ Technologies Used**
- **Backend:** Flask (Python), SQLite
- **Frontend:** HTML, CSS, JavaScript
- **Libraries:** Bootstrap, SweetAlert2

---

## **📂 Project Structure**
```
📂 Classroom-Booking-System
│── app.py               # Main Flask backend
│── database.db          # SQLite database file
│── templates/
│   ├── index.html       # Frontend UI
│── static/
│   ├── style.css        # Stylesheet
│   ├── script.js        # JavaScript logic (booking, auto-suggest, etc.)
│── README.md            # Project documentation
```

---

## **🚀 Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-repo/classroom-booking.git
cd classroom-booking
```

### **2️⃣ Install Dependencies**
Ensure you have **Python 3** installed, then run:
```sh
pip install flask
```

### **3️⃣ Run the Application**
```sh
python app.py
```
The app will be available at **`http://127.0.0.1:5000/`** in your browser.

---

## **🔧 How It Works**
### **Booking a Classroom**
1. Select a professor and room.
2. Choose a date, start time, and end time.
3. Click "Book" to confirm.

### **Booking Validation**
✔ Ensures **no double bookings** for the same time slot.  
✔ Prevents **overlapping reservations**.

### **Deleting a Booking**
- Click the **"Delete"** button to remove a booking.

---

## **🛠 Future Enhancements**
- 📊 **Admin Panel** for better booking management.
- 📩 **Email Notifications** for booking confirmations.
- 📱 **Mobile-friendly UI** improvements.

---

## **🤝 Contributing**
Want to improve this project?  
1. Fork the repository  
2. Create a feature branch  
3. Submit a pull request 🚀

---

## **📜 License**
This project is licensed under the **MIT License**.

---

## **📬 Contact**
For queries, contact: **your.email@example.com**  
Happy coding! 🎉