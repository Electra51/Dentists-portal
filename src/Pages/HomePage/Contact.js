import React from "react";
import contact from "../../assets/images/appointment.png";
import { MessageSquare } from "lucide-react";
import PrimaryButton from "../../Components/PrimaryButton";

const Contact = () => {
  const handleContact = (event) => {
    event.preventDefault();
    const form = event.target;
    const subject = form.subject.value;
    const email = form.email.value;
    const message = form.message.value;

    const contacting = {
      user: message,
      email,
      subject,
    };
    console.log(contacting);
  };

  return (
    <section
      id="contact"
      className="hero mt-32 max-w-7xl mx-auto rounded-md bg-cover bg-center bg-no-repeat"
      style={{ background: `url(${contact})` }}>
      <div className="w-full h-full bg-blue/30 rounded-md">
        <div className="hero-content text-center py-16 px-4 md:px-10">
          <div className="w-full max-w-xl mx-auto">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20">
                <MessageSquare className="w-4 h-4 text-white" />

                <span className="text-white text-sm font-semibold uppercase tracking-wider">
                  Get In Touch
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                Stay Connected With Us
              </h2>

              <p className="text-white/90 text-base md:text-lg">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
            </div>

            <form
              onSubmit={handleContact}
              className="grid grid-cols-1 gap-4 mt-10">
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="input w-full input-bordered"
              />

              <input
                name="subject"
                type="text"
                placeholder="Subject"
                className="input w-full input-bordered"
              />

              <textarea
                className="textarea textarea-bordered w-full h-32"
                name="message"
                placeholder="Your message"></textarea>

              <PrimaryButton
                className="btn btn-primary w-full text-white"
                type="submit"
                value="Submit">
                Submit
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
