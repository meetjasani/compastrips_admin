import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

const _nav =  [
    {
      _tag: 'CSidebarNavItem',
      name: '대시보드',
      to: '/',
      // icon:<CIcon content={freeSet.cilBorderAll} />,
    },
    {
      _tag: 'CSidebarNavItem',
      name: '회원 관리',
      to: '/user-management',
      // icon: <CIcon content={freeSet.cilGroup} />,
    },
    {
        _tag: 'CSidebarNavItem',
        name: '호스팅 여행 일정 내역',
        to:'/hosted-itinery',
        // icon: <CIcon content={freeSet.cilPlaylistAdd} />, 
        
    },
    {
        _tag: 'CSidebarNavItem',
        name: '여행 참석 신청 내역',
        to:'/applied-host',
        // icon: <CIcon content={freeSet.cilHistory} />
    },
    {
      _tag: 'CSidebarNavItem',
      name: '리뷰 관리',
      to:'/review-mang',
      // icon: <CIcon content={freeSet.cilBadge} />,
    },
   
    {
      _tag: 'CSidebarNavDropdown',
      name: '고객지원',
      to: '/',
      // icon:<CIcon content={freeSet.cilCircle} />,
      _children: [
        {
          _tag: 'CSidebarNavItem',
          name: '공지사항',
          to:'/notice',
          icon: <CIcon content={freeSet.cilCircle} />
        },

        {
          _tag: 'CSidebarNavItem',
          name: 'FAQ',
          to:'/faq',
          icon: <CIcon content={freeSet.cilCircle} />,
        },
       
        
      ]
      
    },

    {
      _tag: 'CSidebarNavItem',
      name: '여행 일정  관리',
      to: '/itinerary-management',
      // icon:<CIcon content={freeSet.cilAppsSettings} />,
    },

    {
      _tag: 'CSidebarNavItem',
      name: '여행 코스 DB 관리',
      to: '/Itinerary-Mng-db',
      // icon:<CIcon content={freeSet.cilInbox} />,
    },
]

export default _nav;