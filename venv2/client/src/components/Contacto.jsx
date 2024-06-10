function Contacto() {
  return (
    <>
      <section className="contact section" id="contact">
        <div className="container">
          <div className="row">
            <div className="ml-auto col-lg-5 col-md-6 col-12">
              <h2 className="mb-4 pb-2" data-aos="fade-up" data-aos-delay="200">
                No dudes en escribirnos
              </h2>

              <form
                className="contact-form webform"
                data-aos="fade-up"
                data-aos-delay="400"
                role="form"
              >
                <input
                  type="text"
                  className="form-control"
                  name="cf-name"
                  placeholder="Nombre"
                />

                <input
                  type="email"
                  className="form-control"
                  name="cf-email"
                  placeholder="Correo"
                />

                <textarea
                  className="form-control"
                  rows="5"
                  name="cf-message"
                  placeholder="Mensaje"
                ></textarea>

                <button
                  type="submit"
                  className="form-control"
                  id="submit-button"
                  name="submit"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>

            <div className="mx-auto mt-4 mt-lg-0 mt-md-0 col-lg-5 col-md-6 col-12">
              <h2 className="mb-4" data-aos="fade-up" data-aos-delay="600">
                Encuentranos en
              </h2>

              <p data-aos="fade-up" data-aos-delay="800">
                <i className="fa fa-map-marker mr-1"></i> Duoc UC, Sede Concepcion{" "}
              </p>
              <div
                className="google-map"
                data-aos="fade-up"
                data-aos-delay="900"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.967443053008!2d-73.06476148493225!3d-36.79533097994958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9669b4503c9a1735%3A0x3fc32996839e6986!2sDuoc%20UC%3A%20Sede%20San%20Andr%C3%A9s%20De%20Concepci%C3%B3n!5e0!3m2!1ses-419!2sus!4v1648667504678!5m2!1ses-419!2sus"
                  width="600"
                  height="450"
                  style={{ border: "0" }}
                  allowFullScreen=""
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contacto;
