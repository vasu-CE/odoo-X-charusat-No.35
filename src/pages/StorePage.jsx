import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const storeItems = [
  {
    id: 1,
    name: "Premium Badge",
    description: "Show off your status with this exclusive badge",
    price: 100,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Special Theme",
    description: "Customize your profile with a unique theme",
    price: 200,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Power Boost",
    description: "Get 2x coins for your next 5 contributions",
    price: 300,
    image: "https://via.placeholder.com/150",
  },
];

function StoreItem({ item, onPurchase, userCoins }) {
  const canAfford = userCoins >= item.price;

  return (
    <Card className="w-full max-w-[300px]">
      <CardHeader>
        <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-t-lg" />
        <CardTitle className="mt-2">{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4" />
          <span>{item.price} coins</span>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className="w-full" 
              disabled={!canAfford}
              variant={canAfford ? "default" : "secondary"}
            >
              {canAfford ? "Purchase" : "Not enough coins"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to purchase {item.name} for {item.price} coins?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onPurchase(item)}>
                Confirm Purchase
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

function StorePage() {
  const dispatch = useDispatch();
  const userCoins = useSelector((state) => state.user.coins) || 0;

  const handlePurchase = (item) => {
    // Here you would typically dispatch an action to update the user's coins
    // and maybe add the purchased item to their inventory
    console.log(`Purchased ${item.name} for ${item.price} coins`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Coins Display */}
      <div className="bg-secondary p-4 rounded-lg mb-8 flex items-center gap-2">
        <Coins className="w-6 h-6" />
        <span className="text-xl font-bold">{userCoins} coins available</span>
      </div>

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeItems.map((item) => (
          <StoreItem
            key={item.id}
            item={item}
            onPurchase={handlePurchase}
            userCoins={userCoins}
          />
        ))}
      </div>
    </div>
  );
}

export default StorePage;
