import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosPublic from "../../../Hooks/useAxiosPublick";
import { useState } from "react";

const Education = () => {
  const { register, handleSubmit, reset, setValue } = useForm();

  const [currentEntry, setCurrentEntry] = useState(null);
  const [eduUpdateModal, setEduUpdateModal] = useState(false);

  const imageHostKey = import.meta.env.VITE_imagebb_key;

  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
  const axiosPublic = useAxiosPublic();

  const onSubmit = async (data) => {
    const imageFile = { image: data.image[0] };

    const res = await axiosPublic.post(image_hosting_api, imageFile, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      const education = {
        title: data.title,
        instName: data.instName,
        time: data.time,
        address: data.address,
        certificate: res.data.data.display_url,
      };
      console.log(education);

      const portfolioRes = await axiosPublic.post(
        "/edu/create",
        education
      );

      console.log(portfolioRes.data);

      if (portfolioRes.data.message === "portfolio created successfully!") {
        // show success popup
        reset();
        toast.success(`${data.name} is added to the education.`);
      }
    }
  };

  const { data: edu = [], refetch } = useQuery({
    queryKey: ["education-list"],
    queryFn: async () => {
      const res = await fetch(
        "https://suchy-portfolio-server.onrender.com/edu/all"
      );
      const data = await res.json();
      return data.education;
    },
  });
  console.log(edu, "education");

  const handleUpdateClick = (product) => {
    setCurrentEntry(product);
    setEduUpdateModal(true);

    // Populate the form with the current entry's data
    setValue("title", product.title);
    setValue("instName", product.instName);
    setValue("time", product.time);
    setValue("address", product.address);
  };

  const handleUpdateSubmit = async (data) => {
    if (!currentEntry?._id) return;

    const education = {
      title: data.title,
      instName: data.instName,
      time: data.time,
      address: data.address,
    };

    const educationRes = await axiosPublic.put(
      `/edu/update/${currentEntry._id}`,
      education
    );

    console.log(educationRes.data);

    if (educationRes.data.message === "education updated successfully!") {
      // show success popup

      setEduUpdateModal(false);
      reset();
      toast.success(`${data.name} is added to the education.`);
      refetch();
    }
  };

  const handleDelete = (product) => {
    fetch(
      `https://suchy-portfolio-server.onrender.com/edu/delete/${product}`,
      {
        method: "DELETE",
        // headers: {
        //   authorization: `bearer ${localStorage.getItem("accessToken")}`,
        // },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "line 33");
        if (data.message === "education item has been deleted!") {
          toast.success(`education item deleted successfully`);
          refetch();
        }
      });
  };

  return (
    <div>
      {/* Open the modal using ID.showModal() method */}
      <button className="btn" onClick={() => window.my_modal_1.showModal()}>
        Add New Education/Course
      </button>
      <dialog id="my_modal_1" className="modal">
        <form
          method="dialog"
          className="modal-box w-11/12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-5">
            <label htmlFor="title" className="block">
              Course Title
            </label>
            <div className="relative">
              <input
               {...register("title")}
                id="title"
                name="title"
                type="text"
                placeholder="type your course title"
                className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
            <label htmlFor="instName" className="block">
              Institution Name
            </label>
            <div className="relative">
              <input
               {...register("instName")}
                id="instName"
                name="instName"
                type="text"
                placeholder="type your inst name"
                className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
            <label htmlFor="time" className="block">
              Course Duration
            </label>
            <div className="relative">
              <input
               {...register("time")}
                id="time"
                name="time"
                type="text"
                placeholder="type your course duration"
                className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
            <label htmlFor="image" className="block">
              Course Certificate Image
            </label>
            <div className="relative">
            <input
                {...register("image")}
                type="file"
                placeholder="type your work image here"
                className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
            <label htmlFor="address" className="block">
              Institution Address
            </label>
            <div className="relative">
              <textarea
               {...register("address")}
                id="address"
                name="address"
                placeholder="type your course duration"
                className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                cols="10"
                rows="2"
              ></textarea>
            </div>
          </div>

          <input
            className="btn btn-accent w-full mt-4"
            value="Add New Course"
            type="submit"
          />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {eduUpdateModal && (
        <dialog id="update_modal" className="modal" open>
          <form
            className="modal-box w-11/12"
            onSubmit={handleSubmit(handleUpdateSubmit)}
          >
            <div className="flex justify-between items-start">
              <h1 className="pb-8 text-lg backdrop-blur-sm">
                Update Edu Info
              </h1>
              <p className="font-semibold cursor-pointer" onClick={() => setEduUpdateModal(false)}>
                X
              </p>
            </div>
            <div className="space-y-5">
              <label className="block">Course Title</label>
              <div className="relative">
                <input
                  {...register("title")}
                  type="text"
                  placeholder="type your work title"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <label className="block"> Institution Name</label>
              <div className="relative">
                <textarea
                  {...register("instName")}
                  placeholder="type your work description"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                  cols="15"
                  rows="3"
                ></textarea>
              </div>
              <label className="block"> Course Duration</label>
              <div className="relative">
                <input
                  {...register("time")}
                  type="text"
                  placeholder="type what tech you used"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <label className="block">Institution Address</label>
              <div className="relative">
                <input
                  {...register("address")}
                  type="text"
                  placeholder="paste your work liveLink"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              
            </div>

            <input
              className="btn btn-accent w-full mt-4"
              value="Update Work Sample"
              type="submit"
            />
          </form>
        </dialog>
      )}

      <div>
        <h2 className="text-3xl">All Work Sample</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>n</th>
                <th>certificate</th>
                <th>title</th>
                <th>Time</th>
                <th>Inst Name</th>
                <th>Inst Address</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {edu?.map((product, i) => (
                <tr key={product._id}>
                  <th>{i + 1}</th>
                  <td>
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={product.certificate} alt="certificate" />
                      </div>
                    </div>
                  </td>
                  <td>{product.title}</td>
                  <td>{product.time}</td>
                  <td>{product.instName}</td>
                  <td>{product.address}</td>
                  <td>
                    {
                      <button
                      onClick={() => handleUpdateClick(product)}
                        className="btn btn-xs btn-danger"
                      >
                        Update
                      </button>
                    }
                  </td>
                  <td>
                    {
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-xs btn-danger"
                      >
                        Delete
                      </button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Education;
