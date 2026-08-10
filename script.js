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

    setupEvents();

});


/* =========================================
   EVENT SETUP
========================================= */

function setupEvents() {

    const donorForm = document.getElementById("donorForm");
    const clearButton = document.getElementById("clearButton");
    const searchButton = document.getElementById("searchButton");
    const showAllButton = document.getElementById("showAllButton");


    if (donorForm) {

        donorForm.addEventListener(
            "submit",
            saveDonor
        );

    }


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            resetForm
        );

    }


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchDonor
        );

    }


    if (showAllButton) {

        showAllButton.addEventListener(
            "click",
            showAllDonors
        );

    }

}


/* =========================================
   ADD / UPDATE DONOR
========================================= */

function saveDonor(event) {

    event.preventDefault();


    const donorId =
        document
            .getElementById("donorId")
            .value
            .trim();


    const donorName =
        document
            .getElementById("donorName")
            .value
            .trim();


    const bloodGroup =
        document
            .getElementById("bloodGroup")
            .value;


    const age =
        document
            .getElementById("age")
            .value;


    const mobile =
        document
            .getElementById("mobile")
            .value
            .trim();


    const city =
        document
            .getElementById("city")
            .value
            .trim();


    const lastDonation =
        document
            .getElementById("lastDonation")
            .value;


    /* =====================================
       REQUIRED FIELD VALIDATION
    ===================================== */

    if (
        donorId === "" ||
        donorName === "" ||
        bloodGroup === "" ||
        age === "" ||
        mobile === "" ||
        city === ""
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    /* =====================================
       NAME VALIDATION
    ===================================== */

    if (!/^[A-Za-z ]+$/.test(donorName)) {

        alert(
            "Donor name should contain only letters and spaces."
        );

        return;
    }


    /* =====================================
       CITY VALIDATION
    ===================================== */

    if (!/^[A-Za-z ]+$/.test(city)) {

        alert(
            "City should contain only letters and spaces."
        );

        return;
    }


    /* =====================================
       AGE VALIDATION
    ===================================== */

    const numericAge = Number(age);


    if (
        numericAge < 18 ||
        numericAge > 65
    ) {

        alert(
            "Donor age must be between 18 and 65."
        );

        return;
    }


    /* =====================================
       MOBILE VALIDATION
    ===================================== */

    if (!/^[0-9]{10}$/.test(mobile)) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    /* =====================================
       UPDATE DONOR
    ===================================== */

    if (editingDonorId !== null) {

        const index =
            donors.findIndex(
                function (donor) {

                    return String(donor.id) ===
                        String(editingDonorId);

                }
            );


        if (index !== -1) {

            donors[index] = {

                id: donorId,

                name: donorName,

                bloodGroup: bloodGroup,

                age: numericAge,

                mobile: mobile,

                city: city,

                lastDonation: lastDonation

            };

        }


        editingDonorId = null;


        const submitButton =
            document.querySelector(
                "#donorForm button[type='submit']"
            );


        if (submitButton) {

            submitButton.textContent =
                "Add Donor";

        }


        saveToStorage();

        displayDonors();

        resetForm();


        alert(
            "Donor information updated successfully."
        );

        return;
    }


    /* =====================================
       DUPLICATE DONOR ID CHECK
    ===================================== */

    const duplicate =
        donors.some(
            function (donor) {

                return String(donor.id)
                    .trim()
                    .toLowerCase() ===
                    donorId
                        .trim()
                        .toLowerCase();

            }
        );


    if (duplicate) {

        alert(
            "Donor ID already exists."
        );

        return;
    }


    /* =====================================
       CREATE NEW DONOR
    ===================================== */

    const newDonor = {

        id: donorId,

        name: donorName,

        bloodGroup: bloodGroup,

        age: numericAge,

        mobile: mobile,

        city: city,

        lastDonation: lastDonation

    };


    donors.push(newDonor);


    saveToStorage();

    displayDonors();

    resetForm();


    alert(
        "Donor information added successfully."
    );

}


/* =========================================
   DISPLAY DONORS
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


    if (!tableBody) {

        return;
    }


    tableBody.innerHTML = "";


    if (donorCount) {

        donorCount.textContent =
            list.length +
            (
                list.length === 1
                    ? " Donor"
                    : " Donors"
            );

    }


    /* =====================================
       NO RECORDS
    ===================================== */

    if (list.length === 0) {

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }

        return;
    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }


    /* =====================================
       CREATE TABLE ROWS
    ===================================== */

    list.forEach(
        function (donor) {

            const row =
                document.createElement("tr");


            const donorId =
                String(
                    donor.id ?? ""
                );


            const donorName =
                String(
                    donor.name ?? ""
                );


            const bloodGroup =
                String(
                    donor.bloodGroup ?? ""
                );


            const donorAge =
                String(
                    donor.age ?? ""
                );


            const donorMobile =
                String(
                    donor.mobile ?? ""
                );


            const donorCity =
                String(
                    donor.city ?? ""
                );


            let donationDate =
                "Not Available";


            if (donor.lastDonation) {

                donationDate =
                    formatDate(
                        donor.lastDonation
                    );

            }


            row.innerHTML = `

                <td>
                    ${escapeHTML(donorId)}
                </td>

                <td>
                    ${escapeHTML(donorName)}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(bloodGroup)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(donorAge)}
                </td>

                <td>
                    ${escapeHTML(donorMobile)}
                </td>

                <td>
                    ${escapeHTML(donorCity)}
                </td>

                <td>
                    ${escapeHTML(donationDate)}
                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="btn btn-edit"
                            onclick="editDonorById('${escapeJS(donorId)}')"
                        >
                            Edit
                        </button>

                        <button
                            class="btn btn-delete"
                            onclick="deleteDonorById('${escapeJS(donorId)}')"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


/* =========================================
   SEARCH DONOR
========================================= */

function searchDonor() {

    const searchIdElement =
        document.getElementById(
            "searchId"
        );


    const bloodGroupElement =
        document.getElementById(
            "searchBloodGroup"
        );


    const message =
        document.getElementById(
            "searchMessage"
        );


    const searchId =
        searchIdElement
            ? searchIdElement.value
                .trim()
                .toLowerCase()
            : "";


    const searchBloodGroup =
        bloodGroupElement
            ? bloodGroupElement.value
            : "";


    /* =====================================
       EMPTY SEARCH
    ===================================== */

    if (
        searchId === "" &&
        searchBloodGroup === ""
    ) {

        if (message) {

            message.textContent =
                "Please enter Donor ID or select Blood Group.";

            message.style.color =
                "#dc3545";

        }


        displayDonors();

        return;
    }


    /* =====================================
       SEARCH
    ===================================== */

    const results =
        donors.filter(
            function (donor) {

                const donorId =
                    String(
                        donor.id ?? ""
                    )
                    .trim()
                    .toLowerCase();


                const donorBloodGroup =
                    String(
                        donor.bloodGroup ?? ""
                    );


                const idMatch =
                    searchId === "" ||
                    donorId.includes(searchId);


                const bloodGroupMatch =
                    searchBloodGroup === "" ||
                    donorBloodGroup ===
                    searchBloodGroup;


                return (
                    idMatch &&
                    bloodGroupMatch
                );

            }
        );


    /* =====================================
       RESULTS FOUND
    ===================================== */

    if (results.length > 0) {

        displayDonors(results);


        if (message) {

            message.textContent =
                results.length +
                " donor record(s) found.";

            message.style.color =
                "#198754";

        }

    }


    /* =====================================
       NO RESULTS
    ===================================== */

    else {

        displayDonors([]);


        if (message) {

            message.textContent =
                "No matching donor records found.";

            message.style.color =
                "#dc3545";

        }

    }

}


/* =========================================
   SHOW ALL DONORS
========================================= */

function showAllDonors() {

    const searchId =
        document.getElementById(
            "searchId"
        );


    const bloodGroup =
        document.getElementById(
            "searchBloodGroup"
        );


    const message =
        document.getElementById(
            "searchMessage"
        );


    if (searchId) {

        searchId.value = "";

    }


    if (bloodGroup) {

        bloodGroup.value = "";

    }


    if (message) {

        message.textContent = "";

    }


    displayDonors();

}


/* =========================================
   EDIT DONOR
========================================= */

function editDonorById(id) {

    const donor =
        donors.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!donor) {

        alert(
            "Donor record not found."
        );

        return;
    }


    document.getElementById(
        "donorId"
    ).value =
        donor.id;


    document.getElementById(
        "donorName"
    ).value =
        donor.name;


    document.getElementById(
        "bloodGroup"
    ).value =
        donor.bloodGroup;


    document.getElementById(
        "age"
    ).value =
        donor.age;


    document.getElementById(
        "mobile"
    ).value =
        donor.mobile;


    document.getElementById(
        "city"
    ).value =
        donor.city;


    document.getElementById(
        "lastDonation"
    ).value =
        donor.lastDonation || "";


    editingDonorId =
        donor.id;


    const submitButton =
        document.querySelector(
            "#donorForm button[type='submit']"
        );


    if (submitButton) {

        submitButton.textContent =
            "Update Donor";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================
   DELETE DONOR
========================================= */

function deleteDonorById(id) {

    const donor =
        donors.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!donor) {

        alert(
            "Donor record not found."
        );

        return;
    }


    const confirmation =
        confirm(
            "Are you sure you want to delete " +
            donor.name +
            "'s record?"
        );


    if (!confirmation) {

        return;
    }


    donors =
        donors.filter(
            function (item) {

                return String(item.id) !==
                    String(id);

            }
        );


    saveToStorage();

    displayDonors();


    alert(
        "Donor record deleted successfully."
    );

}


/* =========================================
   RESET FORM
========================================= */

function resetForm() {

    const form =
        document.getElementById(
            "donorForm"
        );


    if (form) {

        form.reset();

    }


    editingDonorId = null;


    const submitButton =
        document.querySelector(
            "#donorForm button[type='submit']"
        );


    if (submitButton) {

        submitButton.textContent =
            "Add Donor";

    }

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
        localStorage.getItem(
            "bloodDonors"
        );


    if (!savedData) {

        donors = [];

        return;
    }


    try {

        donors =
            JSON.parse(
                savedData
            );


        if (!Array.isArray(donors)) {

            donors = [];

        }

    }

    catch (error) {

        console.error(
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
   HTML SAFETY
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   JAVASCRIPT ATTRIBUTE SAFETY
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
        )
        .replace(
            /"/g,
            '\\"'
        );

}