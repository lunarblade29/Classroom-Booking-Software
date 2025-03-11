# schedule.py
from datetime import datetime, timedelta
from flask import Blueprint, render_template, request, jsonify
import sqlite3

schedule_bp = Blueprint("schedule", __name__, template_folder="templates")


def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn


@schedule_bp.route("/schedule")
def index():
    return render_template("schedule.html")


@schedule_bp.route("/get_schedule")
def get_schedule():
    selected_date = request.args.get("date")
    view_type = request.args.get("view")

    conn = get_db_connection()
    cursor = conn.cursor()

    if view_type == "day":
        query = "SELECT * FROM bookings WHERE date = ?"
        params = [selected_date]

    elif view_type == "week":
        date_obj = datetime.strptime(selected_date, "%Y-%m-%d")
        start_of_week = date_obj - timedelta(days=date_obj.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        query = "SELECT * FROM bookings WHERE date BETWEEN ? AND ?"
        params = [start_of_week.strftime("%Y-%m-%d"), end_of_week.strftime("%Y-%m-%d")]

    elif view_type == "month":
        query = "SELECT * FROM bookings WHERE strftime('%Y-%m', date) = strftime('%Y-%m', ?)"
        params = [selected_date]

    cursor.execute(query, params)
    bookings = cursor.fetchall()
    conn.close()

    result = [
        {"room": row["room"], "date": row["date"], "start_time": row["start_time"], "end_time": row["end_time"]}
        for row in bookings
    ]

    print("Fetched Bookings:", result)

    return jsonify(result)
