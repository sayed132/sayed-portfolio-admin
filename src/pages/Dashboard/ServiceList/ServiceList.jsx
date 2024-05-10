import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosPublic from "../../../Hooks/useAxiosPublick";
import { useForm } from "react-hook-form";

const ServiceList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [serviceUpdateModal, setServiceUpdateModal] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();



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
      const portfolio = {
        name: data.name,
        desc: data.desc,
        image: res.data.data.display_url,
      };

      const portfolioRes = await axiosPublic.post("/service/create", portfolio);

      console.log(portfolioRes.data);

      if (portfolioRes.data.message === "service created successfully!") {
        // show success popup
        reset();
        toast.success(`${data.name} is added to the service.`);
      }
    }
  };

  const { data: service = [], refetch } = useQuery({
    queryKey: ["service-list"],
    queryFn: async () => {
      const res = await fetch(
        "https://suchy-portfolio-server.onrender.com/service/all"
      );
      const data = await res.json();
      return data.service;
    },
  });
  console.log(service, "Portfolio");


  const handleUpdateClick = (product) => {
    setCurrentEntry(product);
    setServiceUpdateModal(true);

    // Populate the form with the current entry's data
    setValue("name", product.name);
    setValue("desc", product.desc);
  };

  const handleUpdateSubmit = async (data) => {
    if (!currentEntry?._id) return;

    const service = {
      name: data.name,
      desc: data.desc,
      // image: res.data.data.display_url,
    };

    const serviceRes = await axiosPublic.put(
      `/service/update/${currentEntry._id}`,
      service
    );

    console.log(serviceRes.data);

    if (serviceRes.data.message === "Service updated successfully!") {
      // show success popup

      setServiceUpdateModal(false);
      reset();
      toast.success(`${data.name} is added to the service.`);
      refetch();
    }
  };

  const handleDelete = (product) => {
    fetch(
      `https://suchy-portfolio-server.onrender.com/service/delete/${product}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "line 33");
        if (data.message === "service has been deleted!") {
          toast.success(`service deleted successfully`);
          refetch();
        }
      });
  };

  return (
    <div>
      <div>
        <div className=" flex w-72 items-center justify-start mt-6">
          <button
            onClick={() => setOpenModal(true)}
            className="rounded-md bg-gray-700 py-2 px-5 text-white"
          >
            Add New Service
          </button>
          <div
            onClick={() => setOpenModal(false)}
            className={`fixed z-[100] flex items-center justify-center ${
              openModal ? "opacity-1 visible" : "invisible opacity-0"
            } inset-0 h-full w-full bg-black/20 backdrop-blur-sm duration-100`}
          >
            <div
              onClick={(e_) => e_.stopPropagation()}
              className={`absolute w-full rounded-lg bg-white dark:bg-gray-900 drop-shadow-2xl sm:w-[500px] ${
                openModal
                  ? "opacity-1 translate-y-0 duration-300"
                  : "-translate-y-20 opacity-0 duration-150"
              }`}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="px-5 pb-5 pt-3 lg:pb-10 lg:pt-5 lg:px-10"
              >
                <svg
                  onClick={() => setOpenModal(false)}
                  className="mx-auto mr-0 w-10 cursor-pointer fill-black dark:fill-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"></path>
                  </g>
                </svg>

                <div className="space-y-5">
                  <label htmlFor="name" className="block">
                    Service Title
                  </label>
                  <div className="relative">
                    <input
                      {...register("name")}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="type your service title"
                      className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <label htmlFor="image" className="block">
                    Service Image
                  </label>
                  <div className="relative">
                    <input
                      {...register("image")}
                      type="file"
                      placeholder="type your work image here"
                      className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <label htmlFor="desc" className="block">
                    Service Description
                  </label>
                  <div className="relative">
                    <textarea
                      {...register("desc")}
                      id="desc"
                      name="desc"
                      placeholder="type your service description"
                      className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                      cols="10"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
                {/* button type will be submit for handling form submission*/}
                <button
                  type="submit"
                  className="relative py-2.5 px-5 rounded-lg mt-6 bg-white drop-shadow-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800"
                >
                  Add New Service
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {serviceUpdateModal && (
        <dialog id="update_modal" className="modal" open>
          <form
            className="modal-box w-11/12"
            onSubmit={handleSubmit(handleUpdateSubmit)}
          >
            <div className="flex justify-between items-start">
              <h1 className="pb-8 text-lg backdrop-blur-sm">
                Update Sevice Sample
              </h1>
              <p className="font-semibold cursor-pointer" onClick={() => setServiceUpdateModal(false)}>
                X
              </p>
            </div>
            <div className="space-y-5">
              <label className="block">Service Title</label>
              <div className="relative">
                <input
                  {...register("name")}
                  type="text"
                  placeholder="type your work title"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <label className="block">Service Description</label>
              <div className="relative">
                <textarea
                  {...register("desc")}
                  placeholder="type your work description"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                  cols="15"
                  rows="3"
                ></textarea>
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
        <h2 className="text-3xl my-5">All Service List</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>n</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {service?.map((product, i) => (
                <tr key={product._id}>
                  <th>{i + 1}</th>
                  <td>
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={product.image} alt="" />
                      </div>
                    </div>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.desc}</td>
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

export default ServiceList;
