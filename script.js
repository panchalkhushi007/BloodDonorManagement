/* =========================================
   BLOOD DONOR MANAGEMENT SYSTEM
========================================= */

let donors = [];
let editingDonorId = null;


/* =========================================
   LOAD DONORS
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    loadDonors();
    displayDonors();
});


/* =========================================
   ADD / UPDATE DONOR
========================================= */

document
    .getElementById("donorForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const donorId = document
            .getElementById("donorId")
            .value
            .trim();

        const donorName = document
            .getElementById("donorName")
            .value
            .trim();

        const bloodGroup = document
            .getElementById("bloodGroup")
            .value;

        const age = document
            .getElementById("age")
            .value;

        const mobile = document
            .getElementById("mobile")
            .value
            .trim();

        const city = document
            .getElementById("city")
            .value
            .trim();
        
        const lastDonation = document
            .getElementById("lastDonation")
            .value;


        if (
            donorId === "" ||
            donorName === "" ||
            bloodGroup === "" ||
            age === "" ||
            mobile === "" ||
            city === ""
        ) {
            alert("Please fill all fields.");
            return;
        }


        if (mobile.length !== 10 || isNaN(mobile)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }


        const donor = {
            id: donorId,
            name: donorName,
            bloodGroup: bloodGroup,
            age: age,
            mobile: mobile,
            city: city,
            lastDonation: lastDonation
        };


        /* Update existing donor */

        if (editingDonorId !== null) {

            const index = donors.findIndex(
                donor => donor.id === editingDonorId
            );

            if (index !== -1) {
                donors[index] = donor;
            }

            editingDonorId = null;

            document.querySelector(
                "#donorForm button[type='submit']"
            ).textContent = "Add Donor";

        }

        /* Add new donor */

        else {

            const existingDonor = donors.find(
                donor => donor.id === donorId
            );

            if (existingDonor) {
                alert("Donor ID already exists.");
                return;
            }

            donors.push(donor);
        }


        saveDonors();

        displayDonors();

        resetForm();

        alert("Donor information saved successfully.");
    });


/* =========================================
   DISPLAY DONORS
========================================= */

function displayDonors(list = donors) {

    const tableBody =
        document.getElementById("donorTableBody");

    const emptyMessage =
        document.getElementById("emptyMessage");

    const donorCount =
        document.getElementById("donorCount");


    tableBody.innerHTML = "";


    donorCount.textContent =
        `${list.length} Donor${list.length !== 1 ? "s" : ""}`;


    if (list.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }


    emptyMessage.style.display = "none";


    list.forEach(function (donor) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${donor.id}</td>

            <td>${donor.name}</td>

            <td><strong>${donor.bloodGroup}</strong></td>

            <td>${donor.age}</td>

            <td>${donor.mobile}</td>

            <td>${donor.city}</td>
            <td>${donor.lastDonation || "Not Available"}</td>

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
            .trim();

    const message =
        document.getElementById("searchMessage");


    if (searchId === "") {

        message.textContent =
            "Please enter a Donor ID.";

        message.style.color = "#dc3545";

        displayDonors();

        return;
    }


    const donor =
        donors.find(
            donor => donor.id.toLowerCase() === searchId.toLowerCase()
        );


    if (donor) {

        displayDonors([donor]);

        message.textContent =
            `Donor found: ${donor.name}`;

        message.style.color = "#198754";

    } else {

        displayDonors([]);

        message.textContent =
            "No donor found with this Donor ID.";

        message.style.color = "#dc3545";
    }
}


/* =========================================
   EDIT DONOR
========================================= */

function editDonor(id) {

    const donor =
        donors.find(
            donor => donor.id === id
        );


    if (!donor) {
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

    const donor =
        donors.find(
            donor => donor.id === id
        );


    if (!donor) {
        return;
    }


    const confirmation =
        confirm(
            `Are you sure you want to delete ${donor.name}'s record?`
        );


    if (!confirmation) {
        return;
    }


    donors =
        donors.filter(
            donor => donor.id !== id
        );


    saveDonors();

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

function saveDonors() {

    localStorage.setItem(
        "bloodDonors",
        JSON.stringify(donors)
    );
}


function loadDonors() {

    const storedDonors =
        localStorage.getItem("bloodDonors");


    if (storedDonors) {

        donors =
            JSON.parse(storedDonors);
    }
}