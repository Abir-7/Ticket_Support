import { Router } from "express";
import { UserRoute } from "../modules/users/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { UserProfileRoute } from "../modules/users/userProfile/userProfile.route";
import TicketRoute from "../modules/ticket/ticket.route";
import { ProductRoute } from "../modules/product/product.route";

import { ChatRoute } from "../modules/communication/chat/chat.route";
import { NotificationRouter } from "../modules/notifictaion/notification.route";
import { DistributorRoute } from "../modules/users/distributor/distributor.route";
import { DashboardRoute } from "../modules/dashboard/dashboard.route";

const router = Router();
const apiRoutes = [
  { path: "/user", route: UserRoute },
  { path: "/user", route: UserProfileRoute },
  { path: "/auth", route: AuthRoute },
  { path: "/ticket", route: TicketRoute },
  { path: "/product", route: ProductRoute },
  { path: "/distributor", route: DistributorRoute },
  { path: "/ticket", route: TicketRoute },
  { path: "/chat", route: ChatRoute },
  { path: "/notification", route: NotificationRouter },
  { path: "/dashboard", route: DashboardRoute },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
