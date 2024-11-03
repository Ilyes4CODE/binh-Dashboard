document.addEventListener('DOMContentLoaded', function () {
    fetchRegistrations(); // Initial fetch to load the table
});

// Function to fetch registration data and update the table
function fetchRegistrations() {
    const token = localStorage.getItem('accessToken');
    fetch('http://127.0.0.1:8000/auth/Branch_Registration/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = ''; // Clear any existing rows

        // Base URL for file paths
        const baseUrl = 'http://127.0.0.1:8000';

        // Loop through each record in the response
        data.forEach((record) => {
            const row = `
                <tr>
                    <td style="font-family: 'Tajawal', sans-serif;">${record.arabic_first_name}</td>
                    <td style="font-family: 'Tajawal', sans-serif;">${record.arabic_last_name}</td>
                    <td>${record.latin_fullname}</td>
                    <td>${record.gender}</td>
                    <td>${record.birthday}</td>
                    <td>${record.address}</td>
                    <td>${record.phone_number}</td>
                    <td>${record.email || 'N/A'}</td>
                    <td>${record.category}</td>
                    <td>
                        <!-- Dropdown for Consult Buttons -->
                        <div class="dropdown">
                            <button class="btn btn-primary btn-sm dropdown-toggle" type="button" id="consultDropdown${record.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-file-alt"></i> <!-- Icon for Consult -->
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="consultDropdown${record.id}">
                                <li><a class="dropdown-item" href="${baseUrl}${record.birth_certificat}" target="_blank"><i class="fas fa-file"></i> Birth Cert</a></li>
                                <li><a class="dropdown-item" href="${baseUrl}${record.white_pic}" target="_blank"><i class="fas fa-image"></i> White Pic</a></li>
                                <li><a class="dropdown-item" href="${baseUrl}${record.blood_type}" target="_blank"><i class="fas fa-tint"></i> Blood Type</a></li>
                                <li><a class="dropdown-item" href="${baseUrl}${record.medical_certificat}" target="_blank"><i class="fas fa-notes-medical"></i> Medical Cert</a></li>
                            </ul>
                        </div>
                    </td>
                    <td>
                        ${
                            record.is_accepted
                                ? '<i class="fas fa-check-circle text-success"></i>' // Display check mark if accepted
                                : `
                                <!-- Dropdown for Action Buttons -->
                                <div class="dropdown">
                                    <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="actionDropdown${record.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fas fa-cogs"></i> <!-- Icon for Actions -->
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="actionDropdown${record.id}">
                                        <li><a class="dropdown-item" href="#" onclick="acceptRecord(${record.id})"><i class="fas fa-check-circle"></i> Accept</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="unacceptRecord(${record.id})"><i class="fas fa-times-circle"></i> Unaccept</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="redirectRecord(${record.id})"><i class="fas fa-share-square"></i> Redirect</a></li>
                                    </ul>
                                </div>
                                `
                        }
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
}

// SweetAlert for Accept Action
function acceptRecord(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: `Accept record with ID ${id}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, accept it!',
        cancelButtonText: 'No, cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://127.0.0.1:8000/Registrations/Accepte_Registration/${id}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire('Accepted!', `Record with ID ${id} has been accepted.`, 'success')
                    .then(() => fetchRegistrations());
                } else {
                    Swal.fire('Error', 'Something went wrong while accepting the record.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Something went wrong while accepting the record.', 'error');
            });
        }
    });
}

// SweetAlert for Unaccept Action
function unacceptRecord(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: `Unaccept record with ID ${id}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, unaccept it!',
        cancelButtonText: 'No, cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://127.0.0.1:8000/Registrations/Delete_registration/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire('Unaccepted!', `Record with ID ${id} has been unaccepted.`, 'success')
                    .then(() => fetchRegistrations());
                } else {
                    Swal.fire('Error', 'Something went wrong while unaccepting the record.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Something went wrong while unaccepting the record.', 'error');
            });
        }
    });
}
// SweetAlert for Redirect Action with Branch Dropdown
function redirectRecord(id) {
    // Fetch branch options from the given API
    fetch('http://127.0.0.1:8000/Registrations/All_Branches/')
        .then(response => response.json())
        .then(branchData => {
            // Create the dropdown HTML
            let options = '';
            branchData.forEach(branch => {
                options += `<option value="${branch.id}">${branch.address}</option>`;
            });

            Swal.fire({
                title: 'Select Branch to Redirect',
                html:
                    `<select id="branchSelect" class="swal2-select">
                        ${options}
                    </select>`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Redirect',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    const selectedBranchId = document.getElementById('branchSelect').value;

                    // Use the API to change the branch by passing the registration ID
                    fetch(`http://127.0.0.1:8000/Registrations/redirect_registrations/${id}/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        },
                        body: JSON.stringify({ branche: selectedBranchId })
                    })
                    .then(response => response.json().then(data => ({ status: response.status, body: data })))
                    .then(({ status, body }) => {
                        if (status === 202) {
                            Swal.fire('Redirected!', `Record with ID ${id} has been redirected to branch ID ${selectedBranchId}.`, 'success')
                            .then(() => fetchRegistrations());
                        } else if (status === 400) {
                            Swal.fire('Error', body.error || 'Failed to redirect record.', 'error');
                        } else if (status === 304) {
                            Swal.fire('Warning', 'You are in the same branch.', 'warning');
                        } else {
                            Swal.fire('Error', 'Something went wrong while redirecting the record.', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Error', 'Something went wrong while redirecting the record.', 'error');
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error fetching branches:', error);
            Swal.fire('Error', 'Could not load branch options.', 'error');
        });
}

