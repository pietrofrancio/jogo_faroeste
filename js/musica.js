let audioPreview = new Audio()

// tocar música ao mudar 
document.getElementById('musica').addEventListener('change', (e) => {
    let musica = e.target.value

    audioPreview.pause() // para a anterior
    audioPreview = new Audio(musica)
    audioPreview.volume = 0.5
    audioPreview.play()
})

// adicionei o salvar
document.getElementById('salvar').addEventListener('click', () => {

    const musica =
        document.getElementById('musica').value

    localStorage.setItem(
        'musicaJogo',
        musica
    )

    alert('Música salva!')
})

function voltar() {
    window.location.href = "../index.html";
}