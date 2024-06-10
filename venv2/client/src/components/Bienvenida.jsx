import React from "react";

function Bienvenida() {
  return (
    <>
      <section
        className="hero d-flex flex-column justify-content-center align-items-center"
        id="inicio"
      >
        <div className="bg-overlay"></div>

        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-10 mx-auto col-12">
              <div className="hero-text mt-5 text-center">
                <h6 data-aos="fade-up" data-aos-delay="300"></h6>

                <h1 className="text-white" data-aos="fade-up" data-aos-delay="500">
                  Bienvenido a Llicapilsen
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Bienvenida;
