import moment from 'moment';

export const CustomDateFilter = (choice:any) => {
   
    switch (choice) {
        case '어제':
            //yesterday
            return moment().subtract(1, 'days').toDate()
            // console.log(moment(moment().subtract(1, "days").format('YYYY-MM-DD')).toDate());
        case '오늘':
            // today
            return moment().toDate()
        case '1개월':
            // 1 month
            return moment().subtract(30, "days").toDate();
        case '3개월':
            return moment().subtract(3, "M").toDate();
        case '6개월':
            // setStartDate(moment(moment().subtract(3, "M").startOf("month").format('YYYY-MM-DD')).toDate());
            return moment().subtract(6, "M").toDate();
        case '1년':
            return moment().subtract(1, "y").toDate();        
    }
}
