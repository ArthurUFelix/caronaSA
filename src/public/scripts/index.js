async function verificarLogado() {
  const requisicao = await fetch("/usuarios/1", {
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  });

  // ["", "public", "pages", "login.html"]
  path = location.pathname.split("/");

  if (path[3] !== "login.html" && requisicao.status !== 200) {
    return (location = "/public/pages/login.html");
  }

  if (path[3] === "login.html" && requisicao.status === 200) {
    return (location = "/public/pages/criar-carona.html");
  }
}
