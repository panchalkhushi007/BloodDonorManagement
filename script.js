/* =========================================
   BLOOD DONOR MANAGEMENT SYSTEM
========================================= */

let donors = [];
let editingDonorId = null;


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadDonors();

    displayDonors();

    document
        .getElementById("donorForm")
        .addEventListener("submit", saveDonor);

    document
        .getElementById("clearButton")
        .addEventListener("click", resetForm);

    document
        .getElementById("searchButton")
        .addEventListener("click", searchDonor);

    document
        .getElementById("showAllButton")
        .addEventListener("click", showAllDonors);

});


/* =========================================
   ADD / UPDATE DONOR
========================================= */

function saveDonor(event) {

    event.preventDefault();


    const donorId =
        document.getElementById("donorId").value.trim();

    const donorName =
        document.getElementById("donorName").value.trim();

    const bloodGroup =
        document.getElementById("bloodGroup").value;

    const age =
        document.getElementById("age").value;

    const mobile =
        document.getElementById("mobile").value.trim();

    const city =
        document.getElementById("city").value.trim();

    const lastDonation =
        document.getElementById("lastDonation").value;


    /* Validation */

    if (
        donorId === "" ||
        donorName === "" ||
        bloodGroup === "" ||
        age === "" ||
        mobile === "" ||
        city === ""
    ) {
        alert("Please fill all required fields.");
        return;
    }


    if (Number(age) < 18 || Number(age) > 65) {

        alert("Age must be between 18 and 65.");

        return;
    }


    if (!/^[0-9]{10}$/.test(mobile)) {

        alert("Please enter a valid 10-digit mobile number.");

        return;
    }


    /* =====================================
       UPDATE DONOR
    ====================================== */

    if (editingDonorId !== null) {

        const index = donors.findIndex(function (donor) {

            return donor.id === editingDonorId;

        });


        if (index !== -1) {

            donors[index] = {

                id: donorId,

                name: donorName,

                bloodGroup: bloodGroup,

                age: Number(age),

                mobile: mobile,

                city: city,

                lastDonation: lastDonation

            };

        }


        editingDonorId = null;


        document.querySelector(
            "#donorForm button[type='submit']"
        ).textContent = "Add Donor";


        saveToStorage();

        displayDonors();

        resetForm();


        alert("Donor information updated successfully.");

        return;
    }


    /* =====================================
       CHECK DUPLICATE ID
    ====================================== */

    const alreadyExists = donors.some(function (donor) {

        return donor.id.toLowerCase() === donorId.toLowerCase();

    });


    if (alreadyExists) {

        alert("Donor ID already exists.");

        return;
    }


    /* =====================================
       ADD NEW DONOR
    ====================================== */

    const newDonor = {

        id: donorId,

        name: donorName,

        bloodGroup: bloodGroup,

        age: Number(age),

        mobile: mobile,

        city: city,

        lastDonation: lastDonation

    };


    donors.push(newDonor);


    saveToStorage();

    displayDonors();

    resetForm();


    alert("Donor added successfully.");

}


/* =========================================
   DISPLAY DONORS
========================================= */

function displayDonors(list) {

    if (!list) {

        list = donors;

    }


    const tableBody =
        document.getElementById("donorTableBody");

    const emptyMessage =
        document.getElementById("emptyMessage");

    const donorCount =
        document.getElementById("donorCount");


    tableBody.innerHTML = "";


    /* Count */

    donorCount.textContent =
        list.length +
        (list.length === 1 ? " Donor" : " Donors");


    /* No data */

    if (list.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }


    emptyMessage.style.display = "none";


    /* Create rows */

    list.forEach(function (donor) {

        const row = document.createElement("tr");


        let donationDate = "Not Available";


        if (donor.lastDonation) {

            donationDate =
                formatDate(donor.lastDonation);

        }


        row.innerHTML = `

            <td>${donor.id}</td>

            <td>${donor.name}</td>

            <td>
                <strong>${donor.bloodGroup}</strong>
            </td>

            <td>${donor.age}</td>

            <td>${donor.mobile}</td>

            <td>${donor.city}</td>

            <td>${donationDate}</td>

            <td>

                <div class="action-buttons">

                    <button
                        class="btn btn-edit"
                        onclick="editDonor('${donor.id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="btn btn-delete"
                        onclick="deleteDonor('${donor.id}')"
                    >
                        Delete
                    </button>

                </div>

            </td>
        `;


        tableBody.appendChild(row);

    });

}


/* =========================================
   SEARCH DONOR
========================================= */

function searchDonor() {

    const searchId =
        document
            .getElementById("searchId")
            .value
            .trim()
            .toLowerCase();


    const searchBloodGroup =
        document
            .getElementById("searchBloodGroup")
            .value;


    const message =
        document.getElementById("searchMessage");


    /* No search */

    if (
        searchId === "" &&
        searchBloodGroup === ""
    ) {

        message.textContent =
            "Please enter Donor ID or select Blood Group.";

        message.style.color = "#dc3545";

        displayDonors();

        return;
    }


    /* Search */

    const results = donors.filter(function (donor) {

        const idMatch =
            searchId === "" ||
            donor.id.toLowerCase().includes(searchId);


        const bloodGroupMatch =
            searchBloodGroup === "" ||
            donor.bloodGroup === searchBloodGroup;


        return idMatch && bloodGroupMatch;

    });


    /* Results */

    if (results.length > 0) {

        displayDonors(results);


        message.textContent =
            results.length +
            " donor record(s) found.";


        message.style.color = "#198754";

    }

    else {

        displayDonors([]);


        message.textContent =
            "No matching donor records found.";


        message.style.color = "#dc3545";

    }

}


/* =========================================
   SHOW ALL
========================================= */

function showAllDonors() {

    document.getElementById("searchId").value = "";

    document.getElementById("searchBloodGroup").value = "";

    document.getElementById("searchMessage").textContent = "";

    displayDonors();

}


/* =========================================
   EDIT DONOR
========================================= */

function editDonor(id) {

    const donor = donors.find(function (item) {

        return item.id === id;

    });


    if (!donor) {

        alert("Donor record not found.");

        return;
    }


    document.getElementById("donorId").value =
        donor.id;

    document.getElementById("donorName").value =
        donor.name;

    document.getElementById("bloodGroup").value =
        donor.bloodGroup;

    document.getElementById("age").value =
        donor.age;

    document.getElementById("mobile").value =
        donor.mobile;

    document.getElementById("city").value =
        donor.city;

    document.getElementById("lastDonation").value =
        donor.lastDonation || "";


    editingDonorId = donor.id;


    document.querySelector(
        "#donorForm button[type='submit']"
    ).textContent = "Update Donor";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================
   DELETE DONOR
========================================= */

function deleteDonor(id) {

    const donor = donors.find(function (item) {

        return item.id === id;

    });


    if (!donor) {

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete " +
            donor.name +
            "'s record?"
        );


    if (!confirmDelete) {

        return;
    }


    donors = donors.filter(function (item) {

        return item.id !== id;

    });


    saveToStorage();

    displayDonors();


    alert("Donor record deleted successfully.");

}


/* =========================================
   RESET FORM
========================================= */

function resetForm() {

    document
        .getElementById("donorForm")
        .reset();


    editingDonorId = null;


    document.querySelector(
        "#donorForm button[type='submit']"
    ).textContent = "Add Donor";

}


/* =========================================
   LOCAL STORAGE
========================================= */

function saveToStorage() {

    localStorage.setItem(
        "bloodDonors",
        JSON.stringify(donors)
    );

}


function loadDonors() {

    const savedData =
        localStorage.getItem("bloodDonors");


    if (savedData === null) {

        donors = [];

        return;
    }


    try {

        donors = JSON.parse(savedData);


        if (!Array.isArray(donors)) {

            donors = [];

        }

    }

    catch (error) {

        console.log(
            "Error loading donor data:",
            error
        );

        donors = [];

    }

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(value) {

    const date =
        new Date(value + "T00:00:00");


    if (isNaN(date.getTime())) {

        return value;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}