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
import { Button } from "./ui/button";

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
            Cours Qualifiés Pour Les Elèves
          </h1>
          <hr className=" w-24 text-center border-2 border-red-500 rounded-full" />
          <div>
            <Button>Primaire</Button>
            <Carousel className="w-full max-w-4xl">
              <CarouselContent className="-ml-1">
                {[
                  {
                    num: 1,
                    color: "bg-red-500",
                    title: "Matières Primaire - Année 1",
                    desc: "Première année, centrée sur les compétences de base en lecture et en mathématiques.",
                  },
                  {
                    num: 2,
                    color: "bg-red-400",
                    title: "Matières Primaire - Année 2",
                    desc: "Deuxième année, développement de la lecture, de l'écriture et des premières notions de sciences.",
                  },
                  {
                    num: 3,
                    color: "bg-yellow-500",
                    title: "Matières Primaire - Année 3",
                    desc: "Troisième année, approfondissement de l'histoire, des langues et de la pensée critique.",
                  },
                  {
                    num: 4,
                    color: "bg-lime-500",
                    title: "Matières Primaire - Année 4",
                    desc: "Quatrième année, perfectionnement des compétences et introduction à des sujets plus complexes.",
                  },
                  {
                    num: 5,
                    color: "bg-green-500",
                    title: "Matières Primaire - Année 5",
                    desc: "Cinquième année, consolidation des acquis et initiation aux sciences sociales.",
                  },
                  {
                    num: 6,
                    color: "bg-emerald-600",
                    title: "Matières Primaire - Année 6",
                    desc: "Sixième année, préparation à l'entrée au collège avec un enseignement approfondi.",
                  },
                ].map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-4">
                      <Card className="rounded-xl shadow-md hover:shadow-lg transition h-80 flex">
                        <CardContent className="flex flex-col items-center text-center space-y-3 p-6">
                          {/* Cercle avec numéro */}
                          <div
                            className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg ${item.color}`}
                          >
                            {item.num}
                          </div>

                          {/* Titre */}
                          <h2 className="text-lg font-semibold">
                            {item.title}
                          </h2>

                          {/* Description */}
                          <p className="text-gray-600 text-sm">{item.desc}</p>

                          {/* Bouton */}
                          <Button variant="outline" className="mt-3">
                            Détails du cours
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div>
            <Button>Collège</Button>
            <Carousel className="w-full max-w-4xl">
              <CarouselContent className="-ml-1">
                {[
                  {
                    num: 7,
                    color: "bg-red-500",
                    title: "Matières Primaire - Année 1",
                    desc: "Première année, centrée sur les compétences de base en lecture et en mathématiques.",
                  },
                  {
                    num: 8,
                    color: "bg-red-400",
                    title: "Matières Primaire - Année 2",
                    desc: "Deuxième année, développement de la lecture, de l'écriture et des premières notions de sciences.",
                  },
                  {
                    num: 9,
                    color: "bg-yellow-500",
                    title: "Matières Primaire - Année 3",
                    desc: "Troisième année, approfondissement de l'histoire, des langues et de la pensée critique.",
                  },
                ].map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-4">
                      <Card className="rounded-xl shadow-md hover:shadow-lg transition h-80 flex">
                        <CardContent className="flex flex-col items-center text-center space-y-3 p-6">
                          {/* Cercle avec numéro */}
                          <div
                            className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg ${item.color}`}
                          >
                            {item.num}
                          </div>

                          {/* Titre */}
                          <h2 className="text-lg font-semibold">
                            {item.title}
                          </h2>

                          {/* Description */}
                          <p className="text-gray-600 text-sm">{item.desc}</p>

                          {/* Bouton */}
                          <Button variant="outline" className="mt-3">
                            Détails du cours
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div>
            <Button className="d-flex">Lycée</Button>
            <Carousel className="w-full max-w-4xl">
              <CarouselContent className="-ml-1">
                {[
                  {
                    num: 1,
                    color: "bg-red-500",
                    title: "Matières Primaire - Année 1",
                    desc: "Première année, centrée sur les compétences de base en lecture et en mathématiques.",
                  },
                  {
                    num: 2,
                    color: "bg-red-400",
                    title: "Matières Primaire - Année 2",
                    desc: "Deuxième année, développement de la lecture, de l'écriture et des premières notions de sciences.",
                  },
                  {
                    num: 3,
                    color: "bg-yellow-500",
                    title: "Matières Primaire - Année 3",
                    desc: "Troisième année, approfondissement de l'histoire, des langues et de la pensée critique.",
                  },
                  {
                    num: 4,
                    color: "bg-lime-500",
                    title: "Matières Primaire - Année 4",
                    desc: "Quatrième année, perfectionnement des compétences et introduction à des sujets plus complexes.",
                  },
                ].map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-4">
                      <Card className="rounded-xl shadow-md hover:shadow-lg transition h-80 flex">
                        <CardContent className="flex flex-col items-center text-center space-y-3 p-6">
                          {/* Cercle avec numéro */}
                          <div
                            className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg ${item.color}`}
                          >
                            {item.num}
                          </div>

                          {/* Titre */}
                          <h2 className="text-lg font-semibold">
                            {item.title}
                          </h2>

                          {/* Description */}
                          <p className="text-gray-600 text-sm">{item.desc}</p>

                          {/* Bouton */}
                          <Button variant="outline" className="mt-3">
                            Détails du cours
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularAuthors;
