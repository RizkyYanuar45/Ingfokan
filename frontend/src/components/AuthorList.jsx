// TeamSection.jsx
import React from "react";
import { Users } from "lucide-react";

const AuthorList = () => {
  const teamMembers = [
    {
      name: "Bekzod Fakhrul",
      role: "Designer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Cassie Evans",
      role: "Programmer",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Luke Hodgenya",
      role: "Marketing",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    {
      name: "Patricia",
      role: "Administrator",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      name: "James Rodrigo",
      role: "CEO",
      image: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    {
      name: "Jim Kastner",
      role: "Financial",
      image: "https://randomuser.me/api/portraits/men/57.jpg",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <div className="flex items-center gap-1 mb-6">
        <span className="text-red-500 font-bold text-sm">•</span>
        <h2 className="text-sm font-medium">Ingfokan News Author</h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Image Container */}
            <div className="w-16 h-16 rounded-md overflow-hidden mb-1">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Role Label */}
            <p className="text-[10px] text-gray-500 text-center">
              {member.role}
            </p>

            {/* Name with background */}
            <div className="mt-1 bg-gray-100 w-full rounded-sm py-1">
              <p className="text-xs font-medium text-center">{member.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorList;
