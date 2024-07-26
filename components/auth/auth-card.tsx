import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Socials from "./socials";
import BackButton from "./back-button";

interface AuthCardProps {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonLable: string;
  showSocial?: boolean;
}

const AuthCard = ({
  children,
  cardTitle,
  backButtonHref,
  backButtonLable,
  showSocial,
}: AuthCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLable} />
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
