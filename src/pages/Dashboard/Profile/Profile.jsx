import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";


const Profile = () => {

  const { data: profile = [],  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(
        "https://sayed-portfolio-server.onrender.com/profile"
      );
      const data = await res.json();
      return data.user[0];
    },
  });
  console.log(profile, "profile");


   // Set up state for form data
   const [formData, setFormData] = useState({
    name: profile?.name ,
    email: profile?.email,
    phone: profile?.phone ,
    cv: profile?.cv ,
    resume: profile?.resume,
    facebook: profile?.facebook,
    linkedin: profile?.linkedin ,
    instagram: profile?.instagram,
    twitter: profile?.twitter,
    workTitle: profile?.workTitle ,
    // image: profile?.image || "",
    aboutMe: profile?.aboutMe ,
    address: profile?.address ,
  });

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   // Update the profile using a PUT request
  //   try {
  //     const response = await fetch(
  //       "https://suchy-portfolio-server.onrender.com/profile/update",
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(formData),
  //       }
  //     );

  //     const data = await response.json();

  //     // Handle success or failure
  //     if (response.ok) {
  //       // Display success message
  //       toast.success("Profile updated successfully!");

  //       // Optionally, refresh the profile data using a query
  //       // Add any state refresh here (e.g., refetch the data)
  //     } else {
  //       // Handle error message from the server
  //       toast.error(`Failed to update profile: ${data.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     toast.error("An error occurred while updating the profile.");
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Ensure the profile object is available and contains an _id
    if (!profile?._id) {
      toast.error("Unable to update profile: Missing user ID.");
      return;
    }
  
    // Create the URL using the user's _id
    const url = `https://sayed-portfolio-server.onrender.com/profile/${profile._id}`;
  
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      // Handle success or failure
      if (response.status == 200) {
        // Display success message
        toast.success("Profile updated successfully!");
  
        // Optionally, refresh the profile data using a query
        // Add any state refresh here (e.g., refetch the data)
      } else {
        // Handle error message from the server
        toast.error(`Failed to update profile: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };
  

  return (
    <div className="w-full max-w-md my-12 p-8 space-y-3 rounded-xl border bg-white   font-sans mx-auto">
      <h1 className="text-3xl font-bold text-center text-indigo-600">
        Update Your Profile
      </h1>
      {/* Input fields and the form started */}
      <form action="" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 text-sm">
          <label htmlFor="name" className="block ">
            Your name
          </label>
          <input
          defaultValue={profile?.name}
          onChange={handleChange}
            type="text"
            name="name"
            id="name"
            placeholder="Type Your Name"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="email" className="block ">
            Email
          </label>
          <input
          defaultValue={profile?.email}
          onChange={handleChange}
            type="email"
            name="email"
            id="email"
            placeholder="email address"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="phone" className="block ">
            Phone Number
          </label>
          <input
          defaultValue={profile?.phone}
          onChange={handleChange}
            type="text"
            name="phone"
            id="phone"
            placeholder="phone number"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="cv" className="block ">
            CV Link
          </label>
          <input
          defaultValue={profile?.cv}
          onChange={handleChange}
            type="text"
            name="cv"
            id="cv"
            placeholder="cv link"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="resume" className="block ">
            Resume Link
          </label>
          <input
          defaultValue={profile?.resume}
          onChange={handleChange}
            type="text"
            name="resume"
            id="resume"
            placeholder="resume link paste here"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="facebook" className="block ">
            Facebook Link
          </label>
          <input
          defaultValue={profile?.facebook}
          onChange={handleChange}
            type="text"
            name="facebook"
            id="facebook"
            placeholder="facebook link paste here"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="linkedin" className="block ">
            Linkedin Link
          </label>
          <input
          defaultValue={profile?.linkedin}
          onChange={handleChange}
            type="text"
            name="linkedin"
            id="linkedin"
            placeholder="linkedin link paste here"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="instagram" className="block ">
            Instagram Link
          </label>
          <input
          defaultValue={profile?.instagram}
          onChange={handleChange}
            type="text"
            name="instagram"
            id="instagram"
            placeholder="instagram link paste here"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="twitter" className="block ">
            Twitter Link
          </label>
          <input
          defaultValue={profile?.twitter}
          onChange={handleChange}
            type="text"
            name="twitter"
            id="twitter"
            placeholder="twitter link paste here"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="workTitle" className="block ">
            Work Title
          </label>
          <input
          defaultValue={profile?.workTitle}
          onChange={handleChange}
            type="text"
            name="workTitle"
            id="workTitle"
            placeholder="your workTitle "
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div>
        {/* <div className="space-y-2 text-sm">
          <label htmlFor="image" className="block ">
            Profile Picture Link
          </label>
          <input
          defaultValue={profile?.image}
            type="text"
            name="image"
            id="image"
            placeholder="profile picture link paste here"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
          />
        </div> */}
        <div className="space-y-2 text-sm">
          <label htmlFor="aboutMe" className="block ">
            About You
          </label>
          <textarea
          defaultValue={profile?.aboutMe}
          onChange={handleChange}
            name="aboutMe"
            id="aboutMe"
            placeholder="type your about"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
            cols="15"
            rows="5"
          ></textarea>
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="address" className="block ">
            Your Address
          </label>
          <textarea
          defaultValue={profile?.address}
          onChange={handleChange}
            name="address"
            id="address"
            placeholder="type your Address"
            className="w-full px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring  "
            cols="15"
            rows="5"
          ></textarea>
        </div>

        {/* Sign in Button */}
        <button className="text-lg rounded-xl relative p-[10px] block w-full bg-indigo-600 text-white border-y-4 duration-500 overflow-hidden focus:border-indigo-500 z-50 group">
          Update Profile
          <span className="absolute opacity-0 group-hover:opacity-100 duration-100 group-hover:duration-1000 ease-out flex justify-center inset-0 items-center z-10 text-white">
            Let&apos;s Update
          </span>
          <span className="bg-indigo-800 absolute inset-0 -translate-y-full group-hover:translate-y-0 group-hover:duration-1000"></span>
          <span className="bg-indigo-800 absolute inset-0 translate-y-full group-hover:translate-y-0 group-hover:duration-1000"></span>
          <span className="bg-indigo-800 absolute inset-0 translate-x-full group-hover:translate-x-0 group-hover:delay-300 delay-100 duration-1000"></span>
          <span className="bg-indigo-800 absolute inset-0 -translate-x-full group-hover:translate-x-0 group-hover:delay-300 delay-100 duration-1000"></span>
        </button>
      </form>
    </div>
  );
};

export default Profile;
