import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

//importing icons
import { RefreshCw } from "lucide-react";

const suggestions = [
  "I want to search expert",
  "Export from UK needed",
  "Who knows Python well?",
  "Any expert from Google?",
];

const renderExpertTable = (data) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto mt-4"
    > 
      <p className="font-medium mb-2">
        Here are 10 expert profiles in the sector following your specified
        criteria:
      </p>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2 text-left">Current Role</th>
            <th className="border px-3 py-2 text-left">Experience</th>
            <th className="border px-3 py-2 text-left">Key Skills</th>
            <th className="border px-3 py-2 text-left">Previous Companies</th>
            <th className="border px-3 py-2 text-left">Location</th>
            <th className="border px-3 py-2 text-left">Availability</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, i) => (
            <tr key={i} className="bg-white hover:bg-gray-100">
              <td className="border px-3 py-2">{c.name}</td>
              <td className="border px-3 py-2">{c.role}</td>
              <td className="border px-3 py-2">{c.experience}</td>
              <td className="border px-3 py-2">{c.skills.map((skill) => `${skill} `)}</td>
              <td className="border px-3 py-2">{c.companies.map((com) => `${com} `)}</td>
              <td className="border px-3 py-2">{c.location}</td>
              <td className="border px-3 py-2">{c.availability}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

function App() {
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const newMessages = [...messages, { type: "user", text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post(`${apiUrl}/chat`, {
        messages: newMessages,
        step: step,
        answers,
      });

      if (response.data.data.resolve) {
        setAnswers(() => [...answers,input]);
        setStep((prev) => (prev + 1)%3);
      }

      let aiReply =
        response.data.data.content || "Sorry, I couldn't process that.";

      if (response?.data?.data?.expert) {
        aiReply = renderExpertTable(response?.data?.data?.expert)
      }

      const updatedMessages = [...newMessages, { type: "ai", text: aiReply }];

      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        { type: "ai", text: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const handleReset = () =>{
      setMessages([])
      setInput("")
      setAnswers([])
      setStep(0)
  }

  return (
    <div className="h-screen flex flex-col items-center p-4">
      <div className="w-full p-2 flex justify-between items-center">
        <h1 className="font-bold">Ai Chatbot</h1>
        <button className="cursor-pointer">
          <RefreshCw onClick={()=>handleReset()} className="w-5 h-5"></RefreshCw>
        </button>
      </div>

      <div className="max-w-4xl flex flex-col items-center mx-auto w-full py-4 h-[85%] overflow-y-auto hide-scrollbar">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 text-3xl md:text-5xl font-semibold"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600 font-bold">
            Expert AI
          </span>{" "}
          – How can I help?
        </motion.h1>

        <div className="flex  flex-wrap gap-2 my-4">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => setInput(sug)}
              className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded-full"
            >
              {sug}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-4xl mt-6 rounded-lg space-y-2 "
          style={{ maxHeight: "70vh" }}
        >
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.type === "ai" ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${
                msg.type === "ai" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-2xl ${
                  msg.type === "ai"
                    ? "bg-blue-100 text-black"
                    : "bg-blue-500 text-white"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="px-4 py-2 rounded-lg bg-blue-100 text-black max-w-xs">
                <motion.div
                  className="flex space-x-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.2,
                        repeat: Infinity,
                        repeatType: "loop",
                      },
                    },
                  }}
                >
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="w-2 h-2 bg-black rounded-full"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: [0, 1, 0],
                          transition: {
                            duration: 0.6,
                            repeat: Infinity,
                            repeatType: "loop",
                          },
                        },
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>

      <div className="w-full fixed bottom-8 max-w-4xl mt-4">
        <div className="flex items-center border rounded-full px-3 py-2 bg-white shadow-md">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 outline-none px-2"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="text-blue-500 font-bold text-lg"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
