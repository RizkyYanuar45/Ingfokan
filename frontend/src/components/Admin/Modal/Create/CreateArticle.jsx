import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sparkles,
  Loader2,
  BarChart2,
  FileText,
  Activity,
} from "lucide-react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { getFullImageUrl } from "../../../../utils/imageUrl";

export default function CreateArticle({
  isModalOpen,
  isEditing,
  currentArticle,
  handleInputChange,
  closeModal,
  refreshArticles,
  aiGeneration,
  setAiGeneration,
  startAiGeneration,
}) {
  const api = import.meta.env.VITE_API_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [thumbnail, setThumbnail] = useState(null);
  const [notification, setNotification] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // AI Agent states
  const [aiTopic, setAiTopic] = useState("");
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // Logika Inisialisasi Quill - Diperbaiki agar tidak reset otomatis
  useEffect(() => {
    if (isModalOpen) {
      setThumbnail(null);
      setNotification(null);
      setAiTopic("");
      setShowAiInput(false);
      setAiAnalysis(null);
      fetchAuthorsAndCategories();

      if (quillRef.current && !editorRef.current) {
        const quillInstance = new Quill(quillRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["link", "image", "video"],
              ["clean"],
            ],
          },
          formats: [
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "list",
            "indent",
            "link",
            "image",
            "video",
            "direction",
            "color",
            "background",
            "align",
            "script",
          ],
        });

        editorRef.current = quillInstance;

        quillInstance.on("text-change", () => {
          setContent(quillInstance.root.innerHTML);
        });
      }

      // Sinkronisasi konten (hanya saat mode Edit atau inisialisasi awal)
      if (editorRef.current) {
        if (isEditing && currentArticle.content) {
          editorRef.current.root.innerHTML = currentArticle.content;
          setContent(currentArticle.content);
        } else if (!isEditing) {
          editorRef.current.setText("");
          setContent("");
        }
      }
    } else {
      // Clear content when closed
      setContent("");
      if (editorRef.current) {
        editorRef.current = null;
      }
    }
  }, [isModalOpen, isEditing]);

  const fetchAuthorsAndCategories = async () => {
    setLoading(true);
    try {
      const [authorsResponse, categoriesResponse] = await Promise.all([
        fetch(`${api}/author`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        }),
        fetch(`${api}/category`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        }),
      ]);

      if (authorsResponse.ok && categoriesResponse.ok) {
        const authorsData = await authorsResponse.json();
        const categoriesData = await categoriesResponse.json();
        setAuthors(authorsData.data.data || []);
        setCategories(categoriesData.data.category || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle AI Result when it arrives
  useEffect(() => {
    if (isModalOpen && aiGeneration.result) {
      const data = aiGeneration.result;

      // Clean up title (remove markdown bolding)
      const cleanTitle = (data.title || "").replace(/\*\*/g, "");

      // Update Title in form
      handleInputChange({
        target: { name: "title", value: cleanTitle },
      });

      // Format Markdown ke HTML
      let htmlContent = data.content || "";
      htmlContent = htmlContent
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n\n/g, "<br><br>");

      if (editorRef.current) {
        editorRef.current.root.innerHTML = htmlContent;
        setContent(htmlContent);
        // Sinkronkan ke parent
        handleInputChange({
          target: { name: "content", value: htmlContent },
        });
      }

      // Store analysis data
      setAiAnalysis({
        fastChecker: data.fast_checker,
        rougeScores: data.rouge_scores,
        rougeSummary: data.rougeScores_summary,
      });

      setNotification({
        type: "success",
        message: "AI Content generated successfully!",
      });

      // Clear the result from global state so it's only applied once
      setAiGeneration((prev) => ({ ...prev, result: null }));
      setShowAiInput(false);
    }
  }, [isModalOpen, aiGeneration.result]);

  // Handle AI Error
  useEffect(() => {
    if (isModalOpen && aiGeneration.error) {
      setNotification({ type: "error", message: aiGeneration.error });
      setAiGeneration((prev) => ({ ...prev, error: null }));
    }
  }, [isModalOpen, aiGeneration.error]);

  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) setThumbnail(file);
  };

  const handleFormInputChange = (e) => {
    handleInputChange(e);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setThumbnail(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gunakan konten langsung dari Quill untuk keamanan data
    const finalContent = editorRef.current
      ? editorRef.current.root.innerHTML
      : content;

    const formData = new FormData();
    formData.append("title", currentArticle.title || "");
    formData.append("author_id", currentArticle.author_id || "");
    formData.append("category_id", currentArticle.category_id || "");
    formData.append("content", finalContent);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const url = isEditing
      ? `${api}/article/${currentArticle.id}`
      : `${api}/article`;
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        setNotification({
          type: "success",
          message: `Article ${isEditing ? "updated" : "created"} successfully!`,
        });
        refreshArticles && refreshArticles();
        setTimeout(closeModal, 2500);
      } else {
        const data = await response.json();
        setNotification({
          type: "error",
          message: data.message || "Failed to save article",
        });
      }
    } catch (error) {
      setNotification({ type: "error", message: error.message });
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) {
      setNotification({ type: "error", message: "Please enter a topic" });
      return;
    }

    startAiGeneration(aiTopic);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isEditing ? "Edit Article" : "Create New Article"}
                  </h3>

                  {/* AI Section */}
                  {!isEditing && (
                    <div className="mb-4">
                      {!showAiInput ? (
                        <button
                          type="button"
                          onClick={() => setShowAiInput(true)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          <span>Create with AI Agent</span>
                        </button>
                      ) : (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            <h4 className="text-sm font-semibold text-gray-800">
                              AI Article Generator
                            </h4>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={aiTopic}
                              onChange={(e) => setAiTopic(e.target.value)}
                              placeholder="Enter topic..."
                              className="flex-1 px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
                              disabled={aiGeneration.isGenerating}
                            />
                            <button
                              type="button"
                              onClick={handleGenerateWithAI}
                              disabled={aiGeneration.isGenerating}
                              className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium flex items-center"
                            >
                              {aiGeneration.isGenerating ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                  <span>Generating...</span>
                                </>
                              ) : (
                                "Generate"
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAiInput(false)}
                              disabled={aiGeneration.isGenerating}
                              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {notification && (
                    <div
                      className={`mb-4 flex items-center justify-between p-4 rounded-md border-l-4 ${notification.type === "success" ? "bg-emerald-50 border-emerald-500" : "bg-red-50 border-red-500"}`}
                    >
                      <div className="flex items-center">
                        {notification.type === "success" ? (
                          <CheckCircle className="w-5 h-5 mr-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
                        )}
                        <p
                          className={`text-sm font-medium ${notification.type === "success" ? "text-emerald-800" : "text-red-800"}`}
                        >
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={currentArticle.title || ""}
                        onChange={handleFormInputChange}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Author
                      </label>
                      <select
                        name="author_id"
                        value={currentArticle.author_id || ""}
                        onChange={handleFormInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                        required
                      >
                        <option value="" disabled>
                          Select an author
                        </option>
                        {authors.map((author) => (
                          <option key={author.id} value={author.id}>
                            {author.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        name="category_id"
                        value={currentArticle.category_id || ""}
                        onChange={handleFormInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                        required
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <div className="border border-gray-300 rounded-md">
                        <div ref={quillRef} className="h-64"></div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail
                      </label>
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center rounded border ${dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"} p-4 text-gray-900 shadow-sm sm:p-6 transition-colors`}
                      >
                        <label
                          htmlFor="file-upload"
                          className="mt-2 inline-block rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100 cursor-pointer"
                        >
                          Browse files
                          <input
                            id="file-upload"
                            name="thumbnail"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                    {(thumbnail || (isEditing && currentArticle.thumbnail)) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preview
                        </label>
                        <img
                          src={
                            thumbnail
                              ? URL.createObjectURL(thumbnail)
                              : getFullImageUrl(currentArticle.thumbnail)
                          }
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md border border-gray-200"
                        />
                      </div>
                    )}

                    {/* AI Analysis Section */}
                    {aiAnalysis && (
                      <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-100">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-600 rounded-lg mr-3">
                              <BarChart2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg">
                                Content Quality Analysis
                              </h4>
                              <p className="text-xs text-blue-600 font-medium">
                                AI Agent Performance Metrics
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5">
                          {/* ROUGE Scores Grid */}
                          <div className="grid grid-cols-3 gap-3">
                            {aiAnalysis.rougeScores &&
                              Object.entries(aiAnalysis.rougeScores).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center"
                                  >
                                    <div className="flex items-center mb-1">
                                      <Activity className="w-3 h-3 text-emerald-500 mr-1" />
                                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                        {key.replace("rouge", "ROUGE-")}
                                      </span>
                                    </div>
                                    <div className="w-full mt-2 space-y-1 text-xs text-gray-700">
                                      <p className="flex justify-between">
                                        <span className="font-semibold">fmeasure</span>
                                        <span>{Number(value.fmeasure || 0).toFixed(4)}</span>
                                      </p>
                                      <p className="flex justify-between">
                                        <span className="font-semibold">precision</span>
                                        <span>{Number(value.precision || 0).toFixed(4)}</span>
                                      </p>
                                      <p className="flex justify-between">
                                        <span className="font-semibold">recall</span>
                                        <span>{Number(value.recall || 0).toFixed(4)}</span>
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                          </div>

                          {/* Detail Analysis Sections */}
                          <div className="grid grid-cols-1 gap-4">
                            {/* ROUGE Summary */}
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
                              <h5 className="font-bold text-gray-800 mb-2 flex items-center text-sm">
                                <FileText className="w-4 h-4 mr-2 text-blue-500" />
                                Accuracy Summary
                              </h5>
                              <div 
                                className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap pl-6 italic border-l-2 border-blue-200"
                                dangerouslySetInnerHTML={{ 
                                  __html: aiAnalysis.rougeSummary?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                                }}
                              />
                            </div>

                            {/* Fast Checker */}
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100 shadow-sm">
                              <h5 className="font-bold text-gray-800 mb-2 flex items-center text-sm">
                                <CheckCircle className="w-4 h-4 mr-2 text-purple-500" />
                                Validation Report
                              </h5>
                              <div 
                                className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap pl-6 border-l-2 border-purple-200"
                                dangerouslySetInnerHTML={{ 
                                  __html: aiAnalysis.fastChecker?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/^### (.*$)/gm, '<h6 class="font-bold text-gray-800 mt-2">$1</h6>')
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <Save className="h-4 w-4 mr-2" />{" "}
                {isEditing ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
