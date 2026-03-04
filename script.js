document.getElementById("year").textContent = new Date().getFullYear();

function handleSubmit(e){
  e.preventDefault();
  const status = document.getElementById("formStatus");
  status.textContent = "This form is demo-only right now. Add Formspree or Netlify Forms to make it send.";
  return false;
}