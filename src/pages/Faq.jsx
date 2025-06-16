import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Cuáles son nuestros horarios de atención?",
      answer:
        "Atendemos de lunes a viernes de 9:00 a 20:00, sábados de 8:00 a 18:00 y domingos de 10:00 a 16:00.",
    },
    {
      question: "¿Dónde están ubicadas nuestras sedes?",
      answer:
        "Contamos con dos sedes: Sede Compartir en Av. Compartir #12-34 y Sede Llano Grande en Cra. 56 #78-90.",
    },
    {
      question: "¿Cómo puedo contactarlos?",
      answer:
        "Puedes contactarnos al +57 312 456 5678 o visitando cualquiera de nuestras sedes durante nuestros horarios de atención.",
    },
    {
      question: "¿Qué servicios ofrecen?",
      answer:
        "Ofrecemos consultoría especializada, soporte técnico 24/7 y capacitación empresarial.",
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-12">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-white to-red-600 mb-8"></div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-300 text-lg">
            Encuentra respuestas a las preguntas más comunes sobre Caballeros
            del Señor
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 text-lg">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-black text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-gray-300 mb-6">
            Contáctanos directamente y te ayudaremos con cualquier duda
          </p>
          <a
            href="tel:+573124565678"
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Llamar ahora: +57 312 456 5678
          </a>
        </div>
      </div>
    </div>
  );
};

export default Faq;
