document.addEventListener("DOMContentLoaded", () => {
    const texto = "Inserte su tarjeta para comenzar";
    const destino = document.getElementById("mensaje");
    let index = 0;
    let yaEscrito = false;

    function escribir() {
        if (index < texto.length) {
            destino.innerHTML += texto.charAt(index);
            index++;
            setTimeout(escribir, 40);
        }
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !yaEscrito) {
                destino.innerHTML = ""; // limpia antes de escribir
                escribir();
                yaEscrito = true;
            }
        });
    });

    observer.observe(destino);
});