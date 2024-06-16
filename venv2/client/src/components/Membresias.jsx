function Membresias() {
  return (
    <>
      <section className="feature" id="feature">
        <div className="container">
          <div className="row">
            <div className="d-flex flex-column justify-content-center ml-lg-auto mr-lg-5 col-lg-5 col-md-6 col-12">
              <h2 className="mb-3 text-white" data-aos="fade-up">
                Membresia
              </h2>

              <h6 className="mb-4 text-white" data-aos="fade-up">
                Precios desde ($10.000)
              </h6>

              <p data-aos="fade-up" data-aos-delay="200">
                Hazte miembro y Obtendras ofertas especiales{" "}
                <a rel="nofollow" href="" target="_parent"></a>{" "}
              </p>

              <a
                className="btn custom-btn bg-color mt-3"
                data-aos="fade-up"
                data-aos-delay="300"
                data-toggle="modal"
                data-target="#membershipForm"
                style={{
                  backgroundColor: "tomato",
                  color: "white",
                }}
              >
                Hazte miembro hoy
              </a>
            </div>

            <div className="mr-lg-auto mt-3 col-lg-4 col-md-6 col-12">
              <div className="about-working-hours">
                <div>
                  <h2
                    className="mb-4 text-white"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    Nuestra atencion
                  </h2>

                  <strong
                    className="d-block"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    Domingo : Cerrado
                  </strong>

                  <strong
                    className="mt-3 d-block"
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    Lunes - Viernes
                  </strong>

                  <p data-aos="fade-up" data-aos-delay="800">
                    7:00 AM - 10:00 PM
                  </p>

                  <strong
                    className="mt-3 d-block"
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    Sabado y Domingo
                  </strong>

                  <p data-aos="fade-up" data-aos-delay="800">
                    6:00 AM - 7:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Membresias;
