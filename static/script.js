document.addEventListener("DOMContentLoaded", function () {
    fetchBookings();

    // Predefined list of professors and classrooms
    const professors = [
"Prof. Abhipsa Pal",
"Prof. Abhishek Goel",
"Prof. Aditi Bhutoria ",
"Prof. Amit Dhiman",
"Prof. Anik Mukherjee",
"Prof. Anirvan Pant",
"Prof. Ankit Kumar",
"Prof. Anupama Kondayya",
"Prof. Apoorva Bharadwaj",
"Prof. Arijit Sen",
"Prof. Arnab Bhattacharya",
"Prof. Arpita Ghosh",
"Prof. Arunima Chakraborty",
"Prof. Avijit Bansal ",
"Prof. Avinash Kumar",
"Prof. Ayesha Arora",
"Prof. Ayush Gupta",
"Prof. Balram Avittathur",
"Prof. Bhaskar Chakrabarti",
"Prof. Biju Paul Abraham",
"Prof. Biswatosh Saha",
"Prof. Bodhibrata Nag ",
"Prof. Chayanika Bhayana",
"Prof. Chetan Joshi",
"Prof. Conan Mukherjee",
"Prof. Debabrata Chatterjee",
"Prof. Debashis Saha",
"Prof. Devi Vijay",
"Prof. Dharma Raju Bathini",
"Prof. Karnika Bains ",
"Prof. Kaushik Roy",
"Prof. Koushiki Choudhury",
"Prof. Latasri Hazarika",
"Prof. Madhuparna Karmokar",
"Prof. Manish Kumar Thakur",
"Prof. Manisha Chakrabarty",
"Prof. Manju Jaiswall",
"Prof. Megha Sharma",
"Prof. Nandita Roy ",
"Prof. Nimruji P J",
"Prof. Nisigandha Bhuyan",
"Prof. Partha Priya Datta",
"Prof. Parthapratim Pal",
"Prof. Peeyush Mehta",
"Prof. Pragyan Rath",
"Prof. Prajamitra Bhuyan",
"Prof. Prashant Mishra",
"Prof. Priya Seetharaman",
"Prof. R Rajesh Babu",
"Prof. Rahul Kumar",
"Prof. Rajashik Roy Choudhury",
"Prof. Rajesh Bhattacharya",
"Prof. Rajiv Kumar",
"Prof. Ramendra Singh",
"Prof. Ramya T Venkateswaran",
"Prof. Randhir Kumar",
"Prof. Rashmi Kumari",
"Prof. Rima Mondal",
"Prof. Ritu Mehta",
"Prof. Runa Sarkar",
"Prof. Sabyasachi Mukhopadhyay",
"Prof. Sahadeb Sarkar",
"Prof. Saibal  Chattopadhyay",
"Prof. Saikat Chakraborty",
"Prof. Saikat Maitra",
"Prof. Samarth Gupta",
"Prof. Samit Paul",
"Prof. Saptarshi Purkayashta",
"Prof. Saravana Jaikumar L",
"Prof. Somdeep Chatterjee",
"Prof. Soumyakanti Chakraborty",
"Prof. Sourav Bhattacharya",
"Prof. Subrata Mitra",
"Prof. Sudarshan Kumar",
"Prof. Sudhakara Reddy Syamala",
"Prof. Sudhir Jaiswall",
"Prof. Sumanta Basu",
"Prof. Suren Sista",
"Prof. Tanika Chakraborty",
"Prof. Umang Varshney ",
"Prof. Uttam K. Sarkar",
"Prof. V K Unni",
"Prof. Vidyanand Jha",
"Prof. Vimal Kumar M ",
"Prof. Vishal Bansal ",
"Prof. Vivek Rajvanshi"
    ];

    const classrooms = [
        "A-104",
        "A-105",
        "L-1",
        "L-2",
        "L-3",
        "L-4",
        "L-21",
        "L-22",
        "N-22",
        "L-31",
        "L-32",
        "N-31",
        "N-32",
        "L-51",
        "L-52",
        "AMPHI EAST 150"
    ];
print()

    // Function to populate autocomplete suggestion
    function enableAutocomplete(inputId, datalistId, dataList) {
        let input = document.getElementById(inputId);
        let datalist = document.getElementById(datalistId);

        function updateDatalist(filterText) {
            datalist.innerHTML = "";
            dataList
                .filter(item => item.toLowerCase().includes(filterText.toLowerCase()))
                .forEach(item => {
                    let option = document.createElement("option");
                    option.value = item;
                    datalist.appendChild(option);
                });
        }

        input.addEventListener("input", function () {
            updateDatalist(this.value);
        });

        updateDatalist("");
    }

    enableAutocomplete("professor", "professorList", professors);
    enableAutocomplete("room", "roomList", classrooms);

    // Booking form submission
    document.getElementById("bookingForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let formData = new FormData(this);

        fetch("/book", { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                title: data.status === "success" ? "Success!" : "Error!",
                text: data.message,
                icon: data.status,
                confirmButtonText: "OK"
            });
            if (data.status === "success") {
                fetchBookings();
                document.getElementById("bookingForm").reset();
            }
        });
    });
});

// Fetch existing bookings and update the table with new entries at the top
function fetchBookings() {
    fetch("/get_bookings")
    .then(response => response.json())
    .then(bookings => {
        let table = document.getElementById("bookingTable");
        table.innerHTML = ""; // Clear the table

        bookings.reverse().forEach(booking => { // Reverse order to show new ones first
            // Convert the date from yyyy-mm-dd to dd-mm-yyyy
            let originalDate = booking[3];
            let formattedDate = formatDate(originalDate);
            let newRow = document.createElement("tr");
            newRow.id = `row-${booking[0]}`;
            newRow.innerHTML = `
                <td>${booking[1]}</td>
                <td>${booking[2]}</td>
                <td>${formattedDate}</td>
                <td>${booking[4]}</td>
                <td>${booking[5]}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteBooking(${booking[0]})">Delete</button></td>
            `;
            table.prepend(newRow); // Add new row to the top
        });
    });
}

// 🔧 Helper function to format date
function formatDate(dateStr) {
    const parts = dateStr.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;  // dd-mm-yyyy
}

// Delete a booking and update the table
function deleteBooking(id) {
    fetch(`/delete/${id}`, { method: "POST" })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: "Deleted!",
            text: data.message,
            icon: "success",
            confirmButtonText: "OK"
        });
        fetchBookings();
    });
}
