import React, { useState } from "react";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Cuáles son nuestros horarios de atención?",
      answer:
        "Atendemos de lunes a jueves de 10:00 a 20:00, viernes de 9:30 a 20:00, sábados de 08:00 a 20:30 y domingo o festivos: Alternativos",
    },
    {
      question: "¿Cómo puedo contactarlos?",
      answer:
        "Puedes contactarnos al +57 317 4731877 o visitando cualquiera de nuestras sedes durante nuestros horarios de atención.",
    },
    {
      question: "¿Qué servicios ofrecen?",
      answer:
        "En nuestra barbería no solo nos especializamos en cortes de cabello para caballeros, sino que también ofrecemos servicios para ellas, como corte de puntas, diseño de cejas con henna y tratamientos de mascarillas capilares.",
    },
    {
      question: "¿Atienden sin tener citas?",
      answer:
        "Sí, sin embargo solo serás atendido si hay un espacio de tiempo vacío o después de atender a todos los clientes con reserva.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white  flex flex-col">
      <Header />

      {/* Title Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Preguntas Frecuentes
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-red-500 via-gray-300 to-blue-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-gray-400 text-xl font-medium leading-relaxed ">
          Encuentra respuestas a las preguntas más comunes sobre{" "}
          <span className="font-bold text-red-600">Caballeros del Señor</span>
        </p>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-blue-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold text-blue-800 text-lg">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-red-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 border-t border-blue-100 bg-blue-50">
                  <p className="text-black leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-black/50 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-white mb-6">
            Contáctanos directamente y te ayudaremos con cualquier duda
          </p>
          <a
            href="tel:+573174731877"
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Llamar ahora: +57 317 4731877
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Faq;
