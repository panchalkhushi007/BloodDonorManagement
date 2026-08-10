let donors = [];
let editingDonorId = null;


document.addEventListener("DOMContentLoaded", function () {

    loadDonors();

    displayDonors();

    setupEvents();

});


function setupEvents() {

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

}


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

    const availability =
        document.getElementById("availability").value;


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


    if (!/^[A-Za-z ]+$/.test(donorName)) {

        alert(
            "Donor name should contain only letters and spaces."
        );

        return;
    }


    if (!/^[A-Za-z ]+$/.test(city)) {

        alert(
            "City should contain only letters and spaces."
        );

        return;
    }


    if (
        Number(age) < 18 ||
        Number(age) > 65
    ) {

        alert(
            "Donor age must be between 18 and 65."
        );

        return;
    }


    if (!/^[0-9]{10}$/.test(mobile)) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    const donor = {

        id: donorId,

        name: donorName,

        bloodGroup: bloodGroup,

        age: Number(age),

        mobile: mobile,

        city: city,

        lastDonation: lastDonation,

        availability: availability

    };


    /* UPDATE */

    if (editingDonorId !== null) {

        const index =
            donors.findIndex(function (item) {

                return String(item.id) ===
                    String(editingDonorId);

            });


        if (index !== -1) {

            donors[index] = donor;

        }


        editingDonorId = null;


        document.querySelector(
            "#donorForm button[type='submit']"
        ).textContent = "Add Donor";


        saveToStorage();

        displayDonors();

        resetForm();


        alert(
            "Donor information updated successfully."
        );

        return;
    }


    /* DUPLICATE */

    const duplicate =
        donors.some(function (item) {

            return String(item.id)
                .toLowerCase() ===
                donorId.toLowerCase();

        });


    if (duplicate) {

        alert("Donor ID already exists.");

        return;
    }


    donors.push(donor);

    saveToStorage();

    displayDonors();

    resetForm();


    alert(
        "Donor information added successfully."
    );

}


/* =========================================
   DISPLAY
========================================= */

function displayDonors(list) {

    if (!Array.isArray(list)) {

        list = donors;

    }


    const tableBody =
        document.getElementById(
            "donorTableBody"
        );


    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    const donorCount =
        document.getElementById(
            "donorCount"
        );


    tableBody.innerHTML = "";


    donorCount.textContent =
        list.length +
        (
            list.length === 1
                ? " Donor"
                : " Donors"
        );


    if (list.length === 0) {

        emptyMessage.style.display =
            "block";

        return;
    }


    emptyMessage.style.display =
        "none";


    list.forEach(function (donor) {

        const row =
            document.createElement("tr");


        const donationDate =
            donor.lastDonation
                ? formatDate(donor.lastDonation)
                : "Not Available";


        const availability =
            donor.availability ||
            "Available";


        row.innerHTML = `

            <td>${donor.id}</td>

            <td>${donor.name}</td>

            <td>
                <strong>
                    ${donor.bloodGroup}
                </strong>
            </td>

            <td>${donor.age}</td>

            <td>${donor.mobile}</td>

            <td>${donor.city}</td>

            <td>${donationDate}</td>

            <td>
                <strong>
                    ${availability}
                </strong>
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="btn btn-edit"
                        onclick="editDonorById('${escapeJS(String(donor.id))}')"
                    >
                        Edit
                    </button>

                    <button
                        class="btn btn-delete"
                        onclick="deleteDonorById('${escapeJS(String(donor.id))}')"
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
   SEARCH
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
        document.getElementById(
            "searchMessage"
        );


    if (
        searchId === "" &&
        searchBloodGroup === ""
    ) {

        message.textContent =
            "Please enter Donor ID or select Blood Group.";

        message.style.color =
            "#dc3545";

        displayDonors();

        return;
    }


    const results =
        donors.filter(function (donor) {

            const donorId =
                String(donor.id)
                    .toLowerCase();


            const idMatch =
                searchId === "" ||
                donorId.includes(searchId);


            const bloodMatch =
                searchBloodGroup === "" ||
                donor.bloodGroup ===
                searchBloodGroup;


            return (
                idMatch &&
                bloodMatch
            );

        });


    if (results.length > 0) {

        displayDonors(results);


        message.textContent =
            results.length +
            " donor record(s) found.";


        message.style.color =
            "#198754";

    } else {

        displayDonors([]);


        message.textContent =
            "No matching donor records found.";


        message.style.color =
            "#dc3545";

    }

}


/* =========================================
   SHOW ALL
========================================= */

function showAllDonors() {

    document.getElementById(
        "searchId"
    ).value = "";


    document.getElementById(
        "searchBloodGroup"
    ).value = "";


    document.getElementById(
        "searchMessage"
    ).textContent = "";


    displayDonors();

}


/* =========================================
   EDIT
========================================= */

function editDonorById(id) {

    const donor =
        donors.find(function (item) {

            return String(item.id) ===
                String(id);

        });


    if (!donor) {

        return;
    }


    document.getElementById(
        "donorId"
    ).value = donor.id;


    document.getElementById(
        "donorName"
    ).value = donor.name;


    document.getElementById(
        "bloodGroup"
    ).value =
        donor.bloodGroup;


    document.getElementById(
        "age"
    ).value = donor.age;


    document.getElementById(
        "mobile"
    ).value = donor.mobile;


    document.getElementById(
        "city"
    ).value = donor.city;


    document.getElementById(
        "lastDonation"
    ).value =
        donor.lastDonation || "";


    document.getElementById(
        "availability"
    ).value =
        donor.availability ||
        "Available";


    editingDonorId =
        donor.id;


    document.querySelector(
        "#donorForm button[type='submit']"
    ).textContent =
        "Update Donor";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================
   DELETE
========================================= */

function deleteDonorById(id) {

    const donor =
        donors.find(function (item) {

            return String(item.id) ===
                String(id);

        });


    if (!donor) {

        return;
    }


    if (
        !confirm(
            "Are you sure you want to delete " +
            donor.name +
            "'s record?"
        )
    ) {

        return;
    }


    donors =
        donors.filter(function (item) {

            return String(item.id) !==
                String(id);

        });


    saveToStorage();

    displayDonors();


    alert(
        "Donor record deleted successfully."
    );

}


/* =========================================
   RESET
========================================= */

function resetForm() {

    document
        .getElementById("donorForm")
        .reset();


    editingDonorId = null;


    document.querySelector(
        "#donorForm button[type='submit']"
    ).textContent =
        "Add Donor";

}


/* =========================================
   STORAGE
========================================= */

function saveToStorage() {

    localStorage.setItem(
        "bloodDonors",
        JSON.stringify(donors)
    );

}


function loadDonors() {

    const savedData =
        localStorage.getItem(
            "bloodDonors"
        );


    if (!savedData) {

        donors = [];

        return;
    }


    try {

        donors =
            JSON.parse(savedData);


        if (!Array.isArray(donors)) {

            donors = [];

        }

    } catch (error) {

        donors = [];

    }

}


/* =========================================
   DATE
========================================= */

function formatDate(value) {

    if (!value) {

        return "Not Available";

    }


    const date =
        new Date(
            value + "T00:00:00"
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

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


/* =========================================
   SAFETY
========================================= */

function escapeJS(value) {

    return String(value)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}