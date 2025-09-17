import axios from "axios";
import React, { useEffect, useState } from "react";
import userLogo from "../assets/user.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./ui/card";

const PopularAuthors = () => {
  const [popularUser, setPopularUser] = useState([]);
  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `https://felblad-plateform.onrender.com/api/v1/user/all-users`
      );
      if (res.data.success) {
        setPopularUser(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 items-center">
          <h1 className="text-3xl md:text-4xl font-bold pt-10 ">
            Popular Authors
          </h1>
          <hr className=" w-24 text-center border-2 border-red-500 rounded-full" />
          <Carousel>
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-2xl font-semibold"></span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-2xl font-semibold"></span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-2xl font-semibold"></span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default PopularAuthors;
