$(document).ready(function () {
    // Set default value of date picker to today if not selected
    if (!$("#datePicker").val()) {
        const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
        $("#datePicker").val(today);
    }

    // Bind change events
    $("#datePicker").on("change", loadSchedule);
    $("input[name='viewType']").on("change", loadSchedule);

    // Initial loading
    loadSchedule();
});

// Load schedule data and display table
function loadSchedule() {
    let selectedDate = $("#datePicker").val();
    let viewType = $("input[name='viewType']:checked").val();

    if (!selectedDate) return;

    console.log("Selected Date:", selectedDate);
    console.log("View Type:", viewType);

    $.getJSON("/get_schedule", { date: selectedDate, view: viewType }, function (data) {
        console.log("Fetched Data:", data);

        if (!data || data.length === 0) {
            $("#schedule-body").html("<tr><td colspan='8' class='text-muted'>No bookings available</td></tr>");
            $("#schedule-header").html("");
            return;
        }

        // Define time slots
        const timeSlots = [
            "08:30-10:00", "10:15-11:45", "12:00-13:30",
            "14:30-16:00", "16:15-17:45", "18:00-19:30"
        ];

        // Get relevant dates for the view
        const dates = getDates(selectedDate, viewType);

        // Header Row
        let headerHtml = "<tr><th>Time</th>";
        dates.forEach(date => {
            const [yyyy, mm, dd] = date.split("-");
            const formattedDate = `${dd}-${mm}-${yyyy}`; // Display format
            headerHtml += `<th>${formattedDate}</th>`;
        });
        headerHtml += "</tr>";
        $("#schedule-header").html(headerHtml);

        // Table Body
        let bodyHtml = timeSlots.map(timeSlot => {
            let rowHtml = `<tr><td>${timeSlot}</td>`;
            dates.forEach(date => {
                const bookedRooms = getBookedRoomsForSlot(data, date, timeSlot);
                rowHtml += `<td class="room-box">${formatBookingCells(bookedRooms)}</td>`;
            });
            return rowHtml + "</tr>";
        }).join("");

        $("#schedule-body").html(bodyHtml);
    }).fail(function () {
        $("#schedule-body").html("<tr><td colspan='8' class='text-danger'>Error loading data</td></tr>");
        $("#schedule-header").html("");
    });
}
//Format Booking cells
function formatBookingCells(bookedEntries) {
    const viewType = $("input[name='viewType']:checked").val();

    if (bookedEntries.length > 0) {
        return bookedEntries.map(entry => {
            const classroom = `<strong>${entry.room}</strong>`;
            const profPart = viewType === "day" ? ` – ${entry.professor}` : "";
            return `<div class="booking-line">
                <span class="booked-circle"></span> ${classroom}${profPart}
            </div>`;
        }).join("");
    }

    return `<span class="available-circle"></span> <span class="text-muted">Available</span>`;
}





// Get rooms booked for a time slot
function getBookedRoomsForSlot(data, date, timeSlot) {
    let [slotStartStr, slotEndStr] = timeSlot.split("-");
    let [slotStartHour, slotStartMin] = slotStartStr.split(":").map(Number);
    let [slotEndHour, slotEndMin] = slotEndStr.split(":").map(Number);

    let slotStartMinTotal = slotStartHour * 60 + slotStartMin;
    let slotEndMinTotal = slotEndHour * 60 + slotEndMin;

    let booked = data
        .filter(booking => booking.date === date && isTimeSlotBooked(booking, slotStartMinTotal, slotEndMinTotal))
        .map(booking => ({
            room: booking.room,
            professor: booking.professor || "Unknown"
        }));

    // Optional: remove duplicates (based on room + professor)
    const seen = new Set();
    return booked.filter(entry => {
        const key = `${entry.room}-${entry.professor}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}



// Check if a booking overlaps with a time slot
function isTimeSlotBooked(booking, slotStartMin, slotEndMin) {
    let [bookingStartHour, bookingStartMin] = booking.start_time.split(":").map(Number);
    let [bookingEndHour, bookingEndMin] = booking.end_time.split(":").map(Number);

    let bookingStart = bookingStartHour * 60 + bookingStartMin;
    let bookingEnd = bookingEndHour * 60 + bookingEndMin;

    return !(bookingEnd <= slotStartMin || bookingStart >= slotEndMin);
}

// Generate list of dates based on view type
function getDates(selectedDate, viewType) {
    let dates = [];
    let dateObj = new Date(selectedDate);

    if (viewType === "day") {
        dates.push(selectedDate);
    } else if (viewType === "week") {
        let startOfWeek = new Date(dateObj);
        startOfWeek.setDate(dateObj.getDate() - startOfWeek.getDay() + 1); // Monday
        for (let i = 0; i < 7; i++) {
            let tempDate = new Date(startOfWeek);
            tempDate.setDate(startOfWeek.getDate() + i);
            dates.push(tempDate.toISOString().split("T")[0]);
        }
    } else if (viewType === "month") {
        let startOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        let endOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
        for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
            dates.push(d.toISOString().split("T")[0]);
        }
    }

    console.log("Generated Dates for View:", dates);
    return dates;
}
