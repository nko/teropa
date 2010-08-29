package teropa.ko2010.client;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.Widget;

public class Info extends Composite {

	private static LeftUiBinder uiBinder = GWT.create(LeftUiBinder.class);

	interface LeftUiBinder extends UiBinder<Widget, Info> {
	}

	@UiField
	Label patientZeroLink;
	
	public Info(final Client client) {
		initWidget(uiBinder.createAndBindUi(this));
		patientZeroLink.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				client.goToPatientZero();
			}
		});
	}


}
