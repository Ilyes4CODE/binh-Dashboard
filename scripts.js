// Dark mode toggle
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode'); // Toggle dark mode for body
    document.getElementById('sidebar').classList.toggle('dark-mode'); // Toggle dark mode for sidebar
    document.getElementById('dashboard').classList.toggle('dark-mode'); // Toggle dark mode for dashboard content

    // Toggle icon between moon and sun
    const icon = document.querySelector('#dark-mode-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});
