async function verificarLogado() {
  const requisicao = await fetch("/usuarios/1", {
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  });

  // ["", "public", "pages", "login.html"]
  path = location.pathname.split("/");

  if (path[3] === "login.html" || path[3] === "registro.html") {
    if (requisicao.status === 200)
      return (location = "/public/pages/criar-carona.html");
    return;
  }

  if (requisicao.status !== 200) {
    return (location = "/public/pages/login.html");
  }
}
