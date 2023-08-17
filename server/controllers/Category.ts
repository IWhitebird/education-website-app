import Category from "../models/Category";
import { Request, Response } from "express";

function getRandomInt(max : any) {
    return Math.floor(Math.random() * max)
  }

export async function createCategory(req: Request, res: Response) {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: CategoryDetails,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error in createCategory",
      });
  }
}

export async function showAllCategory(req: Request, res: Response) {
  try {
    const allCategory = await Category.find({});
    res.status(200).json({
      success: true,
      message: "All Category retrieved successfully",
      allCategory,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error in showAllCategory",
      });
  }
}

export async function categoryPageDetails(req: Request, res: Response) {
  try {
    const { categoryId } = req.body;

    // const selectedCategory = await Category.findById(categoryId)
    //   .populate({
    //     path: "course",
    //     match: { status: "published" },
    //     populate: "ratingAndReview",
    //   })
    //   .exec();

      const selectedCategory = await Category.findById(categoryId)
    .populate({
      path: "course",
      match: { status: "published" },
      populate: [
        {
          path: "ratingAndReview",
        },
        {
          path: "instructor",
        },
      ],
    });


    if (selectedCategory?.course.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
    let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "course",
          match: { status: "published" },
          populate: {
            path : "instructor",
          }
        })
        .exec()
      console.log()

    const allCategories = await Category.find()
      .populate({
        path: "course",
        match: { status: "published" },
        populate: {
          path : "instructor",
        }
      })
      .populate({
        path: "course",
        match: { status: "published" },
        populate: {
          path : "ratingAndReview",
        }
      })
      .exec()

    const allCourses = allCategories.flatMap((category) => category.course);
    const mostSellingCourses = allCourses
      .sort((a: any, b: any) => b.sold - a.sold)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      message: "Category page details retrieved successfully",
      selectedCategory,
      differentCategory,
      mostSellingCourses,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error in categoryPageDetails",
      });
  }
}
