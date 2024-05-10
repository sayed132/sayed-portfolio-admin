import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosPublic from "../../../Hooks/useAxiosPublick";
import { useState } from "react";

const PortfolioList = () => {
  const { register, handleSubmit, reset, setValue } = useForm();

  const [currentEntry, setCurrentEntry] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

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
        tech: data.tech,
        time: data.time,
        liveLink: data.liveLink,
        WorkLink: data.WorkLink,
        WorkLink2: data.WorkLink2,
        image: res.data.data.display_url,
      };

      const portfolioRes = await axiosPublic.post(
        "/portfolio/create",
        portfolio
      );

      console.log(portfolioRes.data);

      if (portfolioRes.data.message === "portfolio created successfully!") {
        // show success popup
        reset();
        toast.success(`${data.name} is added to the portfolio.`);
      }
    }
  };

  const { data: portfolio = [], refetch } = useQuery({
    queryKey: ["portfolio-list"],
    queryFn: async () => {
      const res = await fetch(
        "https://suchy-portfolio-server.onrender.com/portfolio/all"
      );
      const data = await res.json();
      return data.portfolio;
    },
  });
  console.log(portfolio, "Portfolio");

  const handleUpdateClick = (product) => {
    setCurrentEntry(product);
    setShowUpdateModal(true);

    // Populate the form with the current entry's data
    setValue("name", product.name);
    setValue("desc", product.desc);
    setValue("tech", product.tech);
    setValue("time", product.time);
    setValue("liveLink", product.liveLink);
    setValue("WorkLink", product.WorkLink);
    setValue("WorkLink2", product.WorkLink2);
    setValue("image", product.image); // Handle file input separately if necessary
  };

  const handleUpdateSubmit = async (data) => {
    if (!currentEntry?._id) return;

    const portfolio = {
      name: data.name,
      desc: data.desc,
      tech: data.tech,
      time: data.time,
      liveLink: data.liveLink,
      WorkLink: data.WorkLink,
      WorkLink2: data.WorkLink2,
      // image: res.data.data.display_url,
    };

    const portfolioRes = await axiosPublic.put(
      `/portfolio/update/${currentEntry._id}`,
      portfolio
    );

    console.log(portfolioRes.data);

    if (portfolioRes.data.message === "portfolio updated successfully!") {
      // show success popup

      setShowUpdateModal(false);
      reset();
      toast.success(`${data.name} is added to the portfolio.`);
      refetch();
    }
  };

  
  const handleDelete = (product) => {
    fetch(
      `https://suchy-portfolio-server.onrender.com/portfolio/delete/${product}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "line 33");
        if (data.message === "portfolio has been deleted!") {
          toast.success(`Work Sample deleted successfully`);
          refetch();
        }
      });
  };
  return (
    <div className="mt-8">
      <button className="btn" onClick={() => window.my_modal_3.showModal()}>
        Add New Work Sample
      </button>
      <dialog id="my_modal_3" className="modal">
        <form
          method="dialog"
          className="modal-box w-11/12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="pb-8 text-4xl backdrop-blur-sm">Add New Service</h1>
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
            <label className="block">Technology Used</label>
            <div className="relative">
              <input
                {...register("tech")}
                type="text"
                placeholder="type what tech you used"
                className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
            <label className="block">Work Live Link</label>
            <div className="relative">
              <input
                {...register("liveLink")}
                type="text"
                placeholder="paste your work liveLink"
                className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
            <label className="block">Work Link</label>
            <div className="relative">
              <input
                {...register("WorkLink")}
                type="text"
                placeholder="paste your work links"
                className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
            <label className="block">Work Link 2</label>
            <div className="relative">
              <input
                {...register("WorkLink2")}
                type="text"
                placeholder="paste your work links"
                className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
            <label className="block">Work Image</label>
            <div className="relative">
              <input
                {...register("image")}
                type="file"
                placeholder="type your work image here"
                className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <input
            className="btn btn-accent w-full mt-4"
            value="Add Work Sample"
            type="submit"
          />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {showUpdateModal && (
        <dialog id="update_modal" className="modal" open>
          <form
            className="modal-box w-11/12"
            onSubmit={handleSubmit(handleUpdateSubmit)}
          >
            <div className="flex justify-between items-start">
              <h1 className="pb-8 text-lg backdrop-blur-sm">
                Update Work Sample
              </h1>
              <p className="font-semibold cursor-pointer" onClick={() => setShowUpdateModal(false)}>
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
              <label className="block">Technology Used</label>
              <div className="relative">
                <input
                  {...register("tech")}
                  type="text"
                  placeholder="type what tech you used"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <label className="block">Work Live Link</label>
              <div className="relative">
                <input
                  {...register("liveLink")}
                  type="text"
                  placeholder="paste your work liveLink"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <label className="block">Work Link</label>
              <div className="relative">
                <input
                  {...register("WorkLink")}
                  type="text"
                  placeholder="paste your work links"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <label className="block">Work Link 2</label>
              <div className="relative">
                <input
                  {...register("WorkLink2")}
                  type="text"
                  placeholder="paste your work links"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              {/* <label className="block">Work Image</label>
              <div className="relative">
                <input
                  {...register("image")}
                  type="file"
                  placeholder="type your work image here"
                  className="block w-full rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white dark:bg-gray-700 dark:text-white"
                />
              </div> */}
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
                <th>Image</th>
                <th>Name</th>
                <th>Time</th>
                <th>Description</th>
                <th>Technology</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {portfolio?.map((product, i) => (
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
                  <td>{product.time}</td>
                  <td>{product.desc}</td>
                  <td>{product.tech}</td>
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

export default PortfolioList;
