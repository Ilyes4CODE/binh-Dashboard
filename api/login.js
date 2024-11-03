// Check if the user is authenticated
function checkAuthentication() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        // Redirect to dashboard if authenticated
        window.location.href = 'dashboard.html'; // Change to your dashboard page URL
    }
}

// Check authentication on page load
checkAuthentication();

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:8000/auth/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            // Store access and refresh tokens
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            // Check if user is in "branch" group
            if (data.user.groups.includes('branch')) {
                window.location.href = 'dashboard.html'; // Redirect to dashboard for branches
            } else {
                if(data.user.groups.includes('admin')){
                    window.location.href = 'admindashboard.html'
                }else{
                    Swal.fire('Access Denied', 'You are not authorized to access this dashboard.', 'error');
                }
            }
        } else {
            Swal.fire('Invalid Credentials', 'Please check your username and password.', 'error');
        }
    })
    .catch(error => {
        Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
        console.error('Error:', error);
    });
});