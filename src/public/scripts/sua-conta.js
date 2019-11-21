$(document).ready(async () => {
  const id = JSON.parse(localStorage.dadosUsuario).id;

  const requisicao = await fetch(`/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  });

  const usuario = await requisicao.json();

  console.log(usuario);
});