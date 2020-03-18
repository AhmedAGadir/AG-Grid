import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';

export default forwardRef((props, ref) => {
    const [date, setDateState] = useState(null);
    const picker = useRef(null);
    const flatpickrComp = useRef(null);

    useEffect(() => {
        picker.current = flatpickr(flatpickrComp.current, {
            onChange: onDateChanged,
            dateFormat: 'd/m/Y',
            wrap: true,
        });
        picker.current.calendarContainer.classList.add(
            'ag-custom-component-popup'
        );
    }, []);

    useImperativeHandle(ref, () => {
        return {
            getDate() {
                console.log('getDate', date);
                return date;
            },
            setDate(date) {
                console.log('setDate', date);
                setDateState(date);
                picker.current.setDate(date);
            },
        };
    }, [date]);

    useEffect(props.onDateChanged, [date]);

    const updateAndNotifyAgGrid = date => {
        console.log('updateAndNotifyAgGrid', date);
        setDateState(date);
    };

    const onDateChanged = selectedDates => {
        console.log('onDateChanged', selectedDates[0]);
        // setDateState(selectedDates[0]);
        updateAndNotifyAgGrid(selectedDates[0]);
    };

    return (
        <div
            className="ag-input-wrapper custom-date-filter"
            role="presentation"
            ref={flatpickrComp}
        >
            <input type="text" data-input />
            <a class="input-button" title="clear" data-clear>
                <i class="fa fa-times"></i>
            </a>
        </div>
    );
});
