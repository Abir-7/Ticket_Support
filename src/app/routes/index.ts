import { Router } from "express";
import { UserRoute } from "../modules/users/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { UserProfileRoute } from "../modules/users/userProfile/userProfile.route";
import TicketRoute from "../modules/ticket/ticket.route";
import { ProductRoute } from "../modules/product/productList/product.route";
import { BrandRoute } from "../modules/product/brand/brand.route";

const router = Router();
const apiRoutes = [
  { path: "/user", route: UserRoute },
  { path: "/user", route: UserProfileRoute },
  { path: "/auth", route: AuthRoute },
  { path: "/ticket", route: TicketRoute },
  { path: "/product", route: ProductRoute },
  { path: "/brand", route: BrandRoute },
  { path: "/ticket", route: TicketRoute },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
