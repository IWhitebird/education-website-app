import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../reducers/reducer";
import { updateProfile } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

interface UserProfile extends FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: number;
  about: string; 
}

export default function EditProfile() {
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfile>();

  const submitProfileForm = async (data : FormData) => {
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error)
    }
  }

  return (
    <>
        <form onSubmit={handleSubmit(submitProfileForm)}>
            {/* Profile Information */}
            <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            <h2 className="text-lg font-semibold text-richblack-5">
                Profile Information
            </h2>
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="firstName" className="lable-style">
                    First Name
                </label>
                <input
                    type="text"
                    id="firstName"
                    placeholder="Enter first name"
                    className="form-style"
                    {...register("firstName", { required: true })}
                    defaultValue={user?.firstName}
                />
                {errors.firstName && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                    Please enter your first name.
                    </span>
                )}
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="lastName" className="lable-style">
                    Last Name
                </label>
                <input
                    type="text"
                    id="lastName"
                    placeholder="Enter first name"
                    className="form-style"
                    {...register("lastName", { required: true })}
                    defaultValue={user?.lastName}
                />
                {errors.lastName && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                    Please enter your last name.
                    </span>
                )}
                </div>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="dateOfBirth" className="lable-style">
                    Date of Birth
                </label>
                <input
                    type="date"
                    id="dateOfBirth"
                    className="form-style"
                    {...register("dateOfBirth", {
                    required: {
                        value: true,
                        message: "Please enter your Date of Birth.",
                    },
                    max: {
                        value: new Date().toISOString().split("T")[0],
                        message: "Date of Birth cannot be in the future.",
                    },
                    })}
                    defaultValue={user?.additionalDetails?.dateOfBirth}
                />
                {errors.dateOfBirth && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                    {errors.dateOfBirth.message}
                    </span>
                )}
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="gender" className="lable-style">
                    Gender
                </label>
                <select
                    id="gender"
                    className="form-style"
                    {...register("gender", { required: true })}
                    defaultValue={user?.additionalDetails?.gender}
                >
                    {genders.map((ele, i) => {
                    return (
                        <option key={i} value={ele}>
                        {ele}
                        </option>
                    )
                    })}
                </select>
                {errors.gender && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                    Please enter your Date of Birth.
                    </span>
                )}
                </div>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="contactNumber" className="lable-style">
                    Contact Number
                </label>
                <input
                    type="tel"
                    id="contactNumber"
                    placeholder="Enter Contact Number"
                    className="form-style"
                    {...register("contactNumber", {
                    required: {
                        value: true,
                        message: "Please enter your Contact Number.",
                    },
                    maxLength: { value: 12, message: "Invalid Contact Number" },
                    minLength: { value: 10, message: "Invalid Contact Number" },
                    })}
                    defaultValue={user?.additionalDetails?.contactNumber}
                />
                {errors.contactNumber && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                    {errors.contactNumber.message}
                    </span>
                )}
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="about" className="lable-style">
                    About
                </label>
                <input
                    type="text"
                    id="about"
                    placeholder="Enter Bio Details"
                    className="form-style"
                    {...register("about", { required: true })}
                    defaultValue={user?.additionalDetails?.about}
                />
                {errors.about && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                    Please enter your About.
                    </span>
                )}
                </div>
            </div>
            </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile");
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" />
        </div>
      </form>
    </>
  );
}


