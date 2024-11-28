import { uniqueId } from "lodash";

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  elementTitle?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: "POST 게시판",
  },

  {
    id: uniqueId(),
    title: "POST 게시판",
    href: "/sample/post/list",
  },
  // {
  //   id: uniqueId(),
  //   title: "MENU 게시판",
  //   href: "/sample/admin/menu/list",
  // },

  {
    navlabel: true,
    subheader: "페이지 가이드",
  },

  {
    id: uniqueId(),
    title: "메인페이지",
    href: "/",
  },

  {
    navlabel: true,
    subheader: "Ui Components 가이드",
  },
  {
    id: uniqueId(),
    title: "Menu Level",
    href: "/menulevel/",
    children: [
      {
        id: uniqueId(),
        title: "Level 1",
        href: "/l1",
      },
      {
        id: uniqueId(),
        title: "Level 1.1",
        href: "/l1.1",
        children: [
          {
            id: uniqueId(),
            title: "Level 2",
            href: "/l2",
          },
          {
            id: uniqueId(),
            title: "Level 2.1",
            href: "/l2.1",
            children: [
              {
                id: uniqueId(),
                title: "Level 3",
                href: "/l3",
              },
              {
                id: uniqueId(),
                title: "Level 3.1",
                href: "/l3.1",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: uniqueId(),
    title: "새창열기 가이드",
    external: true,
    href: "https://google.com",
    target: "_blank",
    elementTitle: "새창 띄우기"
  },
];

export default Menuitems;
