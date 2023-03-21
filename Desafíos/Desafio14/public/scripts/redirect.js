let user = document.getElementById('user').textContent;

Swal.fire({
    icon: 'success',
    title: `Hasta luego ${user}`,
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false
});

function redirectPage() {
    window.location.replace("/login");
}

setTimeout(redirectPage, 2000);