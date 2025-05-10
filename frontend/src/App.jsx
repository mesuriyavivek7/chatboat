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

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const newMessages = [...messages, { type: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://localhost:8080/api/chat", {
        messages: newMessages,
      });

      const aiReply =
        response.data.data.content || "Sorry, I couldn't process that.";

      console.log(aiReply);
      const updatedMessages = [...newMessages, { type: "ai", text: aiReply }];

      setMessages(updatedMessages);

      if (response.data.showExperts) {
        setShowTable(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        { type: "ai", text: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full p-2 flex justify-between items-center">
        <h1 className="font-bold">Ai Chatbot</h1>
        <button className="cursor-pointer">
          <RefreshCw className="w-5 h-5"></RefreshCw>
        </button>
      </div>

      <div className="max-w-4xl flex flex-col items-center  mx-auto w-full py-4 h-5/6 overflow-y-auto">
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
                className={`px-4 py-2 rounded-lg max-w-xs ${
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

          {showTable && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-x-auto mt-4"
            >
              <p className="font-medium mb-2">
                Here are 10 expert profiles in the sector following your
                specified criteria:
              </p>
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-3 py-2 text-left">Name</th>
                    <th className="border px-3 py-2 text-left">Current Role</th>
                    <th className="border px-3 py-2 text-left">Experience</th>
                    <th className="border px-3 py-2 text-left">Key Skills</th>
                    <th className="border px-3 py-2 text-left">
                      Previous Companies
                    </th>
                    <th className="border px-3 py-2 text-left">Location</th>
                    <th className="border px-3 py-2 text-left">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "John Smith",
                      role: "Senior Software Engineer",
                      exp: "10 years",
                      skills: "Java, Cloud Computing, DevOps",
                      companies: "Google, IBM",
                      location: "USA",
                      avail: "Available",
                    },
                    {
                      name: "Maria Gonzalez",
                      role: "IT Project Manager",
                      exp: "12 years",
                      skills: "Agile, Risk Management, Stakeholder Engagement",
                      companies: "Accenture, Deloitte",
                      location: "Spain",
                      avail: "Partially Available",
                    },
                  ].map((c, i) => (
                    <tr key={i} className="bg-white hover:bg-gray-100">
                      <td className="border px-3 py-2">{c.name}</td>
                      <td className="border px-3 py-2">{c.role}</td>
                      <td className="border px-3 py-2">{c.exp}</td>
                      <td className="border px-3 py-2">{c.skills}</td>
                      <td className="border px-3 py-2">{c.companies}</td>
                      <td className="border px-3 py-2">{c.location}</td>
                      <td className="border px-3 py-2">{c.avail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
