 import React, { useRef, useState } from "react";
 import { useLocation, useNavigate } from "react-router-dom";
 import "./influencerDetails.css";
 import htmlDocx from "html-docx-js/dist/html-docx";
 import jsPDF from "jspdf";
 import html2canvas from "html2canvas";
 import API_BASE_URL from "../apiconfig";


 const InfluencerDetails = () => {
   const { state } = useLocation();
   const navigate = useNavigate();
   const contentRef = useRef();
   const influencer = state?.influencer;

   const [isEditing, setIsEditing] = useState(false);
   const [editedInfluencer, setEditedInfluencer] = useState(influencer);


   if (!influencer) {
     return (
       <div className="container">
         <h2>Influencer Not Found</h2>
         <p>No influencer data available. Please go back and select one.</p>
         <button className="add-btn" onClick={() => navigate("/")}>Go Home</button>
       </div>
     );
   }

   const handleChange = (e) => {
     const { name, value } = e.target;
     setEditedInfluencer((prev) => ({ ...prev, [name]: value }));
   };

   const exportToWord = () => {
     const content = contentRef.current.innerHTML;
     const converted = htmlDocx.asBlob(`<html><body>${content}</body></html>`);
     const link = document.createElement("a");
     link.href = URL.createObjectURL(converted);
     link.download = `${editedInfluencer.Name}-Details.docx`;
     link.click();
   };

   const exportToPDF = () => {
     html2canvas(contentRef.current).then((canvas) => {
       const imgData = canvas.toDataURL("image/png");
       const pdf = new jsPDF("p", "pt", "a4");
       const width = pdf.internal.pageSize.getWidth();
       const height = (canvas.height * width) / canvas.width;
       pdf.addImage(imgData, "PNG", 0, 0, width, height);
       pdf.save(`${editedInfluencer.Name}-Details.pdf`);
     });
   };

   const toggleEdit = () => setIsEditing(true);

   const cancelEdit = () => {
     setIsEditing(false);
     setEditedInfluencer(influencer);
   };

   const saveEdit = async () => {
     try {

       const response = await fetch(`${API_BASE_URL}/admin/api/influencer/${editedInfluencer._id}`, {
         method: "PUT",
         headers: {
           "Content-Type": "application/json",

         },
         body: JSON.stringify(editedInfluencer),
       });

       if (!response.ok) {
         throw new Error("Failed to update influencer");
       }

       const result = await response.json();
       setEditedInfluencer(result.data);
       setIsEditing(false);
       alert("Influencer updated successfully!");
     } catch (error) {
       console.error("Update error:", error);
       alert("Error updating influencer. Please try again.");
     }
   };

   return (
     <div className="container">
       <button className="add-btn" onClick={() => navigate(-1)}>← Back</button>
       <div className="export-buttons">
        <button
  className="add-btn"
  onClick={() =>
    navigate(`/influencers/${editedInfluencer._id}/history`, {
      state: { influencerName: editedInfluencer.Name || "" },
    })
  }
>
  History
</button>
         <button className="add-btn" onClick={exportToWord}>Export to Word</button>
         <button className="add-btn" onClick={exportToPDF}>Export to PDF</button>

         {!isEditing ? (
           <button className="add-btn" onClick={toggleEdit}>Edit</button>
         ) : (
           <>
             <button className="add-btn" onClick={saveEdit}>Save</button>
             <button className="add-btn" onClick={cancelEdit}>Cancel</button>
           </>
         )}
       </div>

       <div className="details-card" ref={contentRef}>
         <img
           src={`data:image/png;base64,${editedInfluencer.Photo}`}
           alt="Influencer"
           className="details-img"
         />
         <div className="details-info">
           <button>Add this Influencer</button>

           {Object.entries(editedInfluencer).map(([key, value]) => {
             if (key === "Photo") return null;

             if (key === "SocialMediaPlatformLinks" && Array.isArray(value)) {
               return (
                 <p key={key}>
                   <strong>{key}:</strong>
                   {isEditing ? (
                     value.map((link, index) => (
                       <input
                         key={index}
                         type="text"
                         value={link}
                         className="edit-input"
                         onChange={(e) => {
                           const updatedLinks = [...value];
                           updatedLinks[index] = e.target.value;
                           setEditedInfluencer((prev) => ({
                             ...prev,
                             SocialMediaPlatformLinks: updatedLinks,
                           }));
                         }}
                       />
                     ))
                   ) : (
                     <ul>
                       {value.map((link, index) => (
                         <li key={index}>
                           <a href={link} target="_blank" rel="noopener noreferrer">
                             {link}
                           </a>
                         </li>
                       ))}
                     </ul>
                   )}
                 </p>
               );
             }

             return (
               <p key={key}>
                 <strong>{key}:</strong>{" "}
                 {isEditing ? (
                   <textarea
                     name={key}
                     value={value}
                     onChange={handleChange}
                     rows={key === "ProfileDescription" || key === "InternalNotes" ? 3 : 1}
                     className="edit-input"
                   />
                 ) : (
                   String(value)
                 )}
               </p>
             );
           })}
         </div>
       </div>


     </div>
   );
 };

 export default InfluencerDetails;
