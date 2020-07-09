import React from 'react';
import { IDate, IDateParams } from 'ag-grid-community';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { MyDateFilterParams } from './interfaces';

interface DateComponentProps extends IDateParams {
  filterParams: MyDateFilterParams
}

interface DateComponentState {
  date: Date
}

export default class DateComponent extends React.Component<DateComponentProps, DateComponentState> implements IDate {
  public state: DateComponentState;

  public constructor(props: DateComponentProps) {
    super(props);
    this.state = {
      date: null,
    };
  }

  public componentDidMount() {
    this.props.filterParams.logger();
  }

  public getDate(): Date {
    return this.state.date;
  }

  public setDate(date: Date): void {
    this.setState({ date });
  }

  private onChange = (selectedDate: Date): void => {
    this.setState({ date: selectedDate }, this.props.onDateChanged);
  };

  public render(): React.ReactElement {
    return (
      <div>
        <DatePicker
          portalId="root"
          popperClassName="ag-custom-component-popup"
          selected={this.state.date}
          onChange={this.onChange.bind(this)}
        />
      </div>
    );
  }
}
